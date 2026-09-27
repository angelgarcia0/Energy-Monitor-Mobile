import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { z } from "zod";

import { Button } from "@/components/Button/Button";
import { Input } from "@/components/Input/Input";
import { Modal } from "@/components/Modal/Modal";
import { Theme } from "@/constants/theme";
import type { ApplianceType } from "../../data/deviceChartColors";
import {
  APPLIANCE_ICON,
  APPLIANCE_LABEL,
  APPLIANCE_TYPE_IDS,
  ROOM_OPTIONS,
  type RoomKey,
} from "../../data/deviceMocks";
import type { NewDeviceInput } from "../../hooks/useDevicesState";
import { styles } from "./LinkDeviceModal.styles";

type WizardStep =
  | "discover"
  | "appliance"
  | "network"
  | "connecting"
  | "done";

export interface LinkDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  onAddDevice: (device: NewDeviceInput) => void;
}

interface MockModule {
  id: string;
  code: string;
}

interface MockNetwork {
  id: string;
  ssid: string;
  signal: number;
  secured: boolean;
}

const STEPS: WizardStep[] = [
  "discover",
  "appliance",
  "network",
  "connecting",
  "done",
];

const MOCK_MODULES: MockModule[] = [
  { id: "d1", code: "EM-204" },
  { id: "d2", code: "EM-118" },
  { id: "d3", code: "EM-076" },
];

const MOCK_NETWORKS: MockNetwork[] = [
  { id: "n1", ssid: "Casa-Principal", signal: 90, secured: true },
  { id: "n2", ssid: "Casa-Principal-5G", signal: 78, secured: true },
  { id: "n3", ssid: "Red-Invitados", signal: 55, secured: false },
];

const networkPasswordSchema = z.object({
  password: z.string().trim().min(1, "Ingresa la contraseña de la red"),
});

interface StepDotsProps {
  currentStep: WizardStep;
}

function StepDots({ currentStep }: StepDotsProps) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <View style={styles.stepDots} accessibilityLabel={`Paso ${currentIndex + 1} de ${STEPS.length}`}>
      {STEPS.map((step, index) => (
        <View
          key={step}
          style={[styles.stepDot, index <= currentIndex && styles.stepDotActive]}
        />
      ))}
    </View>
  );
}

interface SignalBarsProps {
  signal: number;
}

function SignalBars({ signal }: SignalBarsProps) {
  const activeBars = signal >= 75 ? 3 : signal >= 45 ? 2 : 1;
  const heights = [6, 9, 12];

  return (
    <View style={styles.signalBars}>
      {heights.map((height, index) => (
        <View
          key={height}
          style={[
            styles.signalBar,
            { height },
            index < activeBars && styles.signalBarActive,
          ]}
        />
      ))}
    </View>
  );
}

export function LinkDeviceModal({
  visible,
  onClose,
  onAddDevice,
}: LinkDeviceModalProps) {
  const { height } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState<WizardStep>("discover");
  const [scanning, setScanning] = useState(true);
  const [scanNonce, setScanNonce] = useState(0);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedAppliance, setSelectedAppliance] =
    useState<ApplianceType | null>(null);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [completedSteps, setCompletedSteps] = useState(0);
  const [deviceName, setDeviceName] = useState("");
  const [roomKey, setRoomKey] = useState<RoomKey>("livingRoom");

  const selectedNetwork =
    MOCK_NETWORKS.find((network) => network.id === selectedNetworkId) ?? null;

  useEffect(() => {
    if (step !== "discover" || !scanning) return;

    const timer = setTimeout(() => setScanning(false), 1800);
    return () => clearTimeout(timer);
  }, [scanNonce, scanning, step]);

  useEffect(() => {
    if (step !== "connecting") return;

    const timers = [
      setTimeout(() => setCompletedSteps(1), 700),
      setTimeout(() => setCompletedSteps(2), 1500),
      setTimeout(() => setCompletedSteps(3), 2100),
      setTimeout(() => {
        setDeviceName((currentName) =>
          currentName.trim()
            ? currentName
            : APPLIANCE_LABEL[selectedAppliance ?? "other"],
        );
        setStep("done");
      }, 2500),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [selectedAppliance, step]);

  const handleRescan = () => {
    setSelectedModuleId(null);
    setScanning(true);
    setScanNonce((current) => current + 1);
  };

  const handleSelectNetwork = (networkId: string) => {
    setSelectedNetworkId(networkId);
    setPassword("");
    setPasswordError("");
  };

  const handleConnect = () => {
    if (!selectedNetwork) return;

    if (selectedNetwork.secured) {
      const result = networkPasswordSchema.safeParse({ password });
      if (!result.success) {
        setPasswordError(
          result.error.issues[0]?.message ?? "Ingresa la contraseña de la red",
        );
        // El campo de contraseña queda al final del área scrolleable; sin este
        // scroll el error queda oculto detrás del footer.
        requestAnimationFrame(() =>
          scrollRef.current?.scrollToEnd({ animated: true }),
        );
        return;
      }
    }

    setPasswordError("");
    setCompletedSteps(0);
    setStep("connecting");
  };

  const handleFinish = () => {
    const applianceType = selectedAppliance ?? "other";

    onAddDevice({
      name: deviceName.trim() || APPLIANCE_LABEL[applianceType],
      applianceType,
      roomKey,
    });
    onClose();
  };

  const renderDiscoverStep = () => (
    <>
      <Text style={styles.stepTitle}>Buscando módulos cercanos</Text>
      <Text style={styles.stepHint}>
        Asegúrate de que el módulo esté conectado al tomacorriente y en modo de
        emparejamiento
      </Text>

      {scanning ? (
        <View style={styles.scanningBox}>
          <View style={styles.scannerCircle}>
            <ActivityIndicator
              size="large"
              color={Theme.colors.primary}
            />
          </View>
          <Text style={styles.scanningText}>Escaneando...</Text>
        </View>
      ) : (
        <>
          <Text style={styles.blockLabel}>Módulos encontrados</Text>
          <View style={styles.optionList}>
            {MOCK_MODULES.map((module) => {
              const selected = module.id === selectedModuleId;

              return (
                <Pressable
                  key={module.id}
                  onPress={() => setSelectedModuleId(module.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`Módulo ${module.code}`}
                  style={({ pressed }) => [
                    styles.optionRow,
                    selected && styles.optionRowSelected,
                    pressed && styles.optionRowPressed,
                  ]}
                >
                  <View style={styles.optionIcon}>
                    <MaterialCommunityIcons
                      name="chip"
                      size={Theme.typography.size.md}
                      color={Theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.optionText}>{module.code}</Text>
                  {selected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={Theme.typography.size.md}
                      color={Theme.colors.primary}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Button variant="ghost" size="small" onPress={handleRescan} style={styles.rescanButton}>
            Buscar de nuevo
          </Button>
        </>
      )}
    </>
  );

  const renderApplianceStep = () => (
    <>
      <Text style={styles.stepTitle}>¿Qué electrodoméstico vas a monitorear?</Text>
      <Text style={styles.stepHint}>
        Selecciona el tipo de electrodoméstico que quedará conectado a este
        módulo
      </Text>

      <View style={styles.applianceGrid}>
        {APPLIANCE_TYPE_IDS.map((applianceType) => {
          const selected = applianceType === selectedAppliance;

          return (
            <Pressable
              key={applianceType}
              onPress={() => setSelectedAppliance(applianceType)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={APPLIANCE_LABEL[applianceType]}
              style={({ pressed }) => [
                styles.applianceOption,
                selected && styles.applianceOptionSelected,
                pressed && styles.optionRowPressed,
              ]}
            >
              <View style={styles.applianceIcon}>
                <MaterialCommunityIcons
                  name={APPLIANCE_ICON[applianceType]}
                  size={Theme.typography.size.size22}
                  color={Theme.colors.primary}
                />
              </View>
              <Text style={styles.applianceLabel} numberOfLines={2}>
                {APPLIANCE_LABEL[applianceType]}
              </Text>
              {selected ? (
                <Ionicons
                  name="checkmark-circle"
                  size={Theme.typography.size.md}
                  color={Theme.colors.primary}
                  style={styles.applianceCheck}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </>
  );

  const renderNetworkStep = () => (
    <>
      <Text style={styles.stepTitle}>Conecta a tu red WiFi</Text>
      <Text style={styles.stepHint}>
        Selecciona la red a la que se conectará el módulo
      </Text>

      <View style={styles.optionList}>
        {MOCK_NETWORKS.map((network) => {
          const selected = network.id === selectedNetworkId;

          return (
            <Pressable
              key={network.id}
              onPress={() => handleSelectNetwork(network.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={network.ssid}
              style={({ pressed }) => [
                styles.optionRow,
                selected && styles.optionRowSelected,
                pressed && styles.optionRowPressed,
              ]}
            >
              <View style={styles.networkInfo}>
                <Text style={styles.networkName}>{network.ssid}</Text>
                <View style={styles.networkMeta}>
                  <SignalBars signal={network.signal} />
                  {network.secured ? (
                    <Ionicons
                      name="lock-closed"
                      size={Theme.typography.size.xs}
                      color={Theme.colors.textSecondary}
                    />
                  ) : (
                    <Text style={styles.openTag}>Abierta</Text>
                  )}
                </View>
              </View>
              {selected ? (
                <Ionicons
                  name="checkmark-circle"
                  size={Theme.typography.size.md}
                  color={Theme.colors.primary}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>

      {selectedNetwork?.secured ? (
        <View style={styles.field}>
          <Input
            label="Contraseña"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            placeholder="Ingresa la contraseña de la red"
            secureTextEntry={!showPassword}
            icon={
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={Theme.typography.size.lg}
                color={Theme.colors.textSecondary}
              />
            }
            onIconPress={() => setShowPassword((current) => !current)}
          />
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : (
            // Reserva la línea del error para que el scroll no salte al validar.
            <Text style={styles.errorSlot} />
          )}
        </View>
      ) : null}
    </>
  );

  const renderConnectingStep = () => {
    const connectionSteps = [
      `Buscando la red "${selectedNetwork?.ssid ?? ""}"`,
      "Verificando contraseña",
      "Sincronizando dispositivo",
    ];

    return (
      <>
        <Text style={styles.stepTitle}>Conectando dispositivo</Text>
        <View style={styles.connectingBox}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <View style={styles.connectingList}>
            {connectionSteps.map((label, index) => {
              const done = index < completedSteps;

              return (
                <View key={label} style={styles.connectingRow}>
                  <View
                    style={[
                      styles.connectingDot,
                      done && styles.connectingDotDone,
                    ]}
                  >
                    {done ? (
                      <Ionicons
                        name="checkmark"
                        size={Theme.typography.size.xs}
                        color={Theme.colors.surface}
                      />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      styles.connectingText,
                      done && styles.connectingTextDone,
                    ]}
                  >
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </>
    );
  };

  const renderDoneStep = () => (
    <>
      <View style={styles.doneBox}>
        <Ionicons
          name="checkmark-circle"
          size={Theme.typography.size.xxxl}
          color={Theme.colors.success}
        />
        <Text style={styles.doneTitle}>¡Dispositivo vinculado!</Text>
        <Text style={styles.stepHint}>
          Tu dispositivo ya está conectado y enviando datos
        </Text>
      </View>

      <View style={styles.field}>
        <Input
          label="Nombre del dispositivo"
          value={deviceName}
          onChangeText={setDeviceName}
          placeholder={APPLIANCE_LABEL[selectedAppliance ?? "other"]}
          maxLength={40}
          autoCapitalize="sentences"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Ubicación</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={roomKey}
            onValueChange={(value) => setRoomKey(String(value) as RoomKey)}
            mode="dropdown"
            style={styles.picker}
            dropdownIconColor={Theme.colors.textSecondary}
          >
            {ROOM_OPTIONS.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
                color={Theme.colors.textPrimary}
              />
            ))}
          </Picker>
        </View>
      </View>
    </>
  );

  const renderStepContent = () => {
    switch (step) {
      case "discover":
        return renderDiscoverStep();
      case "appliance":
        return renderApplianceStep();
      case "network":
        return renderNetworkStep();
      case "connecting":
        return renderConnectingStep();
      case "done":
        return renderDoneStep();
    }
  };

  const renderFooter = () => {
    if (step === "discover") {
      return (
        <>
          <Button variant="secondary" onPress={onClose} style={styles.footerButton}>
            Cancelar
          </Button>
          <Button
            onPress={() => setStep("appliance")}
            disabled={!selectedModuleId}
            style={styles.footerButton}
          >
            Continuar
          </Button>
        </>
      );
    }

    if (step === "appliance") {
      return (
        <>
          <Button
            variant="secondary"
            onPress={() => setStep("discover")}
            style={styles.footerButton}
          >
            Atrás
          </Button>
          <Button
            onPress={() => setStep("network")}
            disabled={!selectedAppliance}
            style={styles.footerButton}
          >
            Continuar
          </Button>
        </>
      );
    }

    if (step === "network") {
      return (
        <>
          <Button
            variant="secondary"
            onPress={() => setStep("appliance")}
            style={styles.footerButton}
          >
            Atrás
          </Button>
          <Button
            onPress={handleConnect}
            disabled={!selectedNetwork}
            style={styles.footerButton}
          >
            Conectar
          </Button>
        </>
      );
    }

    if (step === "connecting") {
      return (
        <Button variant="secondary" onPress={onClose} style={styles.footerButton}>
          Cancelar
        </Button>
      );
    }

    return (
      <Button onPress={handleFinish} style={styles.footerButton}>
        Finalizar
      </Button>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      title="Vincular dispositivo"
      footer={renderFooter()}
    >
      <ScrollView
        ref={scrollRef}
        style={[styles.scroll, { maxHeight: height * 0.62 }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepDots currentStep={step} />
        {renderStepContent()}
      </ScrollView>
    </Modal>
  );
}
