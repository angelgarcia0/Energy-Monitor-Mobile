import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import { errorMessage } from "@/services/http";
import {
  connectModule,
  scanForModules,
  type DiscoveredModule,
  type ModuleSession,
  type ScannedNetwork,
} from "@/services/devices/ble";
import type { ApplianceType } from "../../../data/deviceChartColors";
import {
  APPLIANCE_ICON,
  APPLIANCE_TYPE_IDS,
  applianceTypeIdFor,
  getApplianceLabel,
  getRoomLabel,
  ROOM_KEYS,
  type RoomKey,
} from "../../../data/deviceTypes";
import type { DevicesState } from "../../../hooks/useDevicesState";
import {
  ConnectingStep,
  DoneStep,
  isFailureStatus,
  PROGRESS,
  type ProgressKey,
} from "./ConnectingStep";
import { DiscoverStep, StepDots } from "./DiscoverStep";
import { NetworkStep } from "./NetworkStep";
import { styles } from "./LinkDeviceModal.styles";
import { stepStyles } from "./steps.styles";

/** Cuánto se espera a que el módulo confirme `mqtt_ok`. */
const CONNECT_TIMEOUT_MS = 90_000;

const STEPS = ["discover", "appliance", "network", "connecting", "done"] as const;
type Step = (typeof STEPS)[number];

export interface LinkDeviceModalProps {
  visible: boolean;
  state: DevicesState;
  onClose: () => void;
  /** Se llama solo cuando el módulo quedó registrado y conectado. */
  onLinked: () => void;
}

/**
 * Asistente de vinculación por Bluetooth.
 *
 * El orden de los dos actos que importan es el de la Web, y no casual:
 * `POST /homes/{id}/devices` va **antes** de escribir por BLE, porque su respuesta
 * trae `apiKey` y `broker`, que son justo los datos que hay que mandarle al
 * módulo. Al revés no habría qué enviar, y además se dejaría en el backend un
 * módulo que nunca se configuró.
 */
export function LinkDeviceModal({
  visible,
  state,
  onClose,
  onLinked,
}: LinkDeviceModalProps) {
  const { t } = useTranslation("linkDeviceModal");
  const { height } = useWindowDimensions();
  const { catalog, linkDevice } = state;

  const sessionRef = useRef<ModuleSession | null>(null);
  const offStatusRef = useRef<(() => void) | null>(null);

  const [step, setStep] = useState<Step>("discover");
  const [error, setError] = useState<string | null>(null);

  // Paso 1: módulo
  const [modules, setModules] = useState<DiscoveredModule[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deviceCode, setDeviceCode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);

  // Paso 2: electrodoméstico
  const [appliance, setAppliance] = useState<ApplianceType | null>(null);
  const [deviceName, setDeviceName] = useState("");
  const [room, setRoom] = useState<RoomKey>("livingRoom");

  // Paso 3: red
  const [networks, setNetworks] = useState<ScannedNetwork[]>([]);
  const [network, setNetwork] = useState<ScannedNetwork | null>(null);
  const [manual, setManual] = useState(false);
  const [manualSsid, setManualSsid] = useState("");
  const [password, setPassword] = useState("");
  const [scanningNetworks, setScanningNetworks] = useState(false);

  // Paso 4: progreso
  const [progress, setProgress] = useState(0);

  const closeSession = useCallback(() => {
    offStatusRef.current?.();
    offStatusRef.current = null;
    void sessionRef.current?.disconnect();
    sessionRef.current = null;
  }, []);

  // Al cerrar el modal se suelta el Bluetooth: dejarlo conectado gasta batería
  // y el módulo tiene una sola conexión.
  useEffect(() => closeSession, [closeSession]);

  const reset = useCallback(() => {
    setStep("discover");
    setError(null);
    setModules([]);
    setSelectedId(null);
    setDeviceCode("");
    setBlocked(null);
    setAppliance(null);
    setDeviceName("");
    setRoom("livingRoom");
    setNetworks([]);
    setNetwork(null);
    setManual(false);
    setManualSsid("");
    setPassword("");
    setProgress(0);
  }, []);

  const handleClose = useCallback(() => {
    closeSession();
    reset();
    onClose();
  }, [closeSession, onClose, reset]);

  const ssid = manual ? manualSsid.trim() : (network?.ssid ?? "");
  const needsPassword = manual || !!network?.secured;
  const applianceTypeId = appliance ? applianceTypeIdFor(appliance, catalog) : undefined;

  // ── Paso 1: buscar y conectar al módulo ────────────────────────────
  const handleSearch = async () => {
    setError(null);
    setBlocked(null);
    setScanning(true);
    closeSession();
    setModules([]);
    setSelectedId(null);
    setDeviceCode("");

    try {
      const outcome = await scanForModules();
      if (outcome.status !== "ok") {
        // El motivo se guarda aparte porque tiene su propio aviso: son fallos de
        // permisos o de Bluetooth apagado, no del módulo.
        setBlocked(
          outcome.status === "permissionDenied"
            ? t("discover.permissionDenied")
            : outcome.status === "bluetoothOff"
              ? t("discover.bluetoothOff")
              : outcome.status === "unsupported"
                ? t("discover.unsupported")
                : t("errors.bluetooth"),
        );
        return;
      }

      setModules(outcome.modules);
      if (outcome.modules.length === 0) setError(t("discover.noneFound"));
    } catch {
      setError(t("errors.bluetooth"));
    } finally {
      setScanning(false);
    }
  };

  const handleSelectModule = async (id: string) => {
    setError(null);
    setSelectedId(id);
    setDeviceCode("");

    try {
      const session = await connectModule(id);
      sessionRef.current = session;
      // El código viene del módulo, no de lo que se escriba: es la identidad que
      // el backend espera, y por lo tanto lo único que vale.
      setDeviceCode(session.identity.code);
    } catch {
      setSelectedId(null);
      setError(t("errors.bluetooth"));
    }
  };

  // ── Paso 3: pedir al módulo las redes que ve ────────────────────────
  const scanNetworks = useCallback(async () => {
    const session = sessionRef.current;
    if (!session) return;

    setScanningNetworks(true);
    setError(null);
    try {
      const list = await session.scanNetworks();
      setNetworks(list);
      // Sin redes visibles no hay nada que elegir y se pasa a escribirla a mano.
      if (list.length === 0) setManual(true);
    } catch {
      setError(t("errors.bluetooth"));
    } finally {
      setScanningNetworks(false);
    }
  }, [t]);

  const goToNetwork = () => {
    if (!deviceCode || !applianceTypeId || !deviceName.trim()) return;
    setStep("network");
    if (networks.length === 0) void scanNetworks();
  };

  // ── Paso 4: registrar en el backend y luego escribir por BLE ────────
  const handleConnect = async () => {
    const session = sessionRef.current;
    if (!session || !applianceTypeId || !ssid) return;
    if (needsPassword && !manual && !password) {
      setError(t("errors.passwordRequired"));
      return;
    }

    setError(null);
    setStep("connecting");
    setProgress(PROGRESS.registering);

    // Primero el backend: devuelve el apiKey y la dirección del broker.
    const outcome = await linkDevice({
      deviceCode,
      name: deviceName.trim(),
      applianceTypeId,
      location: room,
    });
    if (!outcome.ok) {
      setError(errorMessage(t, outcome.error));
      setStep("network");
      return;
    }

    const { linked } = outcome;

    // Sin `broker.host` el módulo no tiene a dónde conectar. Es una configuración
    // del backend (`DEVICE_MQTT_PUBLIC_HOST`), no algo que se pueda arreglar desde
    // el móvil, así que se dice y se vuelve a la red.
    if (!linked.broker?.host || !linked.apiKey) {
      setError(t("errors.noBroker"));
      setStep("network");
      return;
    }

    offStatusRef.current = session.onStatus((status) => {
      if (status in PROGRESS) {
        setProgress(PROGRESS[status as ProgressKey]);
      }
    });

    try {
      setProgress(PROGRESS.sending);
      const settled = session.waitFor(
        (status) => status === "mqtt_ok" || isFailureStatus(status),
        CONNECT_TIMEOUT_MS,
      );

      await session.sendConfig({
        ssid,
        pass: password,
        host: linked.broker.host,
        port: linked.broker.port,
        id: linked.device.idDevice,
        key: linked.apiKey,
      });

      const status = await settled;
      if (status === "mqtt_ok") {
        setProgress(PROGRESS.mqtt_ok);
        setStep("done");
        return;
      }

      setError(
        status === "wifi_failed:auth"
          ? t("errors.wifiAuth")
          : status === "wifi_failed:notfound"
            ? t("errors.wifiNotFound")
            : status.startsWith("wifi_failed")
              ? t("errors.wifiFailed")
              : t("errors.broker"),
      );
      // Un fallo de red deja volver a elegirla; uno de broker no.
      if (status.startsWith("wifi_failed")) setStep("network");
    } catch {
      setError(t("errors.timeout"));
    } finally {
      offStatusRef.current?.();
      offStatusRef.current = null;
    }
  };

  const handleFinish = () => {
    closeSession();
    reset();
    onLinked();
  };

  const stepIndex = STEPS.indexOf(step);
  const connectingFailed = step === "connecting" && !!error;

  const footer = (() => {
    if (step === "discover") {
      return (
        <>
          <Button variant="secondary" onPress={handleClose} style={styles.footerButton}>
            {t("buttons.cancel")}
          </Button>
          <Button
            onPress={() => setStep("appliance")}
            disabled={!deviceCode || !!blocked}
            style={styles.footerButton}
          >
            {t("buttons.continue")}
          </Button>
        </>
      );
    }

    if (step === "appliance") {
      return (
        <>
          <Button variant="secondary" onPress={() => setStep("discover")} style={styles.footerButton}>
            {t("buttons.back")}
          </Button>
          <Button
            onPress={goToNetwork}
            disabled={!appliance || !deviceName.trim()}
            style={styles.footerButton}
          >
            {t("buttons.continue")}
          </Button>
        </>
      );
    }

    if (step === "network") {
      return (
        <>
          <Button variant="secondary" onPress={() => setStep("appliance")} style={styles.footerButton}>
            {t("buttons.back")}
          </Button>
          <Button
            onPress={() => void handleConnect()}
            disabled={!ssid || scanningNetworks}
            style={styles.footerButton}
          >
            {t("buttons.connect")}
          </Button>
        </>
      );
    }

    if (step === "connecting") {
      return (
        <>
          <Button variant="secondary" onPress={handleClose} style={styles.footerButton}>
            {t("buttons.cancel")}
          </Button>
          {connectingFailed ? (
            <Button onPress={() => setStep("network")} style={styles.footerButton}>
              {t("buttons.retry")}
            </Button>
          ) : null}
        </>
      );
    }

    return (
      <Button onPress={handleFinish} style={styles.footerButton}>
        {t("buttons.finish")}
      </Button>
    );
  })();

  return (
    <Modal visible={visible} onRequestClose={handleClose} title={t("title")} footer={footer}>
      <View style={styles.stepHeader}>
        <Text style={stepStyles.stepOf}>
          {t("step", { current: stepIndex + 1, total: STEPS.length })}
        </Text>
        <StepDots total={STEPS.length} current={stepIndex} />
      </View>

      <ScrollView
        style={[styles.scroll, { maxHeight: height * 0.55 }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === "discover" ? (
          <DiscoverStep
            modules={modules}
            selectedId={selectedId}
            scanning={scanning}
            blocked={blocked}
            onSearch={() => void handleSearch()}
            onSelect={(id) => void handleSelectModule(id)}
          />
        ) : null}

        {step === "appliance" ? (
          <View style={stepStyles.block}>
            <Text style={stepStyles.stepTitle}>{t("appliance.title")}</Text>
            <Text style={stepStyles.stepSubtitle}>{t("appliance.hint")}</Text>

            <Text style={styles.blockLabel}>{t("done.moduleLabel")}</Text>
            <View style={styles.moduleChip}>
              <Text style={styles.moduleChipText}>{deviceCode}</Text>
            </View>

            <Text style={styles.blockLabel}>{t("appliance.title")}</Text>
            <View style={styles.applianceGrid}>
              {APPLIANCE_TYPE_IDS.map((type) => {
                const selected = type === appliance;
                return (
                  <Pressable
                    key={type}
                    onPress={() => {
                      setAppliance(type);
                      if (!deviceName.trim()) {
                        setDeviceName(getApplianceLabel(t, type));
                      }
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={getApplianceLabel(t, type)}
                    style={({ pressed }) => [
                      styles.applianceOption,
                      selected && styles.applianceOptionSelected,
                      pressed && styles.applianceOptionPressed,
                    ]}
                  >
                    <View style={styles.applianceIcon}>
                      <MaterialCommunityIcons
                        name={APPLIANCE_ICON[type]}
                        size={Theme.typography.size.size22}
                        color={Theme.colors.primary}
                      />
                    </View>
                    <Text style={styles.applianceLabel} numberOfLines={2}>
                      {getApplianceLabel(t, type)}
                    </Text>
                    {selected ? (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={Theme.typography.size.md}
                        color={Theme.colors.primary}
                        style={styles.applianceCheck}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            <Input
              label={`${t("done.nameLabel")} ${t("done.optional")}`}
              value={deviceName}
              onChangeText={setDeviceName}
              placeholder={getApplianceLabel(t, appliance ?? "other")}
              maxLength={50}
              autoCapitalize="sentences"
              accessibilityLabel={t("done.nameLabel")}
            />

            <View>
              <Text style={styles.label}>{t("done.roomLabel")}</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={room}
                  onValueChange={(value) => setRoom(String(value) as RoomKey)}
                  mode="dropdown"
                  dropdownIconColor={Theme.colors.textSecondary}
                >
                  {ROOM_KEYS.map((key) => (
                    <Picker.Item
                      key={key}
                      label={getRoomLabel(t, key)}
                      value={key}
                      color={Theme.colors.textPrimary}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        ) : null}

        {step === "network" ? (
          <NetworkStep
            networks={networks}
            selected={network}
            scanning={scanningNetworks}
            manual={manual}
            manualSsid={manualSsid}
            password={password}
            onSelect={setNetwork}
            onToggleManual={() => {
              setManual((value) => !value);
              setError(null);
            }}
            onManualSsid={setManualSsid}
            onPassword={(value) => {
              setPassword(value);
              if (error) setError(null);
            }}
            onRescan={() => void scanNetworks()}
          />
        ) : null}

        {step === "connecting" ? (
          <ConnectingStep progress={progress} failed={connectingFailed} ssid={ssid} />
        ) : null}

        {step === "done" ? <DoneStep deviceName={deviceName.trim()} /> : null}

        {error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
      </ScrollView>
    </Modal>
  );
}