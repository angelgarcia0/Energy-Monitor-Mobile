import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { tMessage } from "@/validation/i18nMessage";
import type { ApplianceType } from "../../data/deviceChartColors";
import {
  APPLIANCE_ICON,
  APPLIANCE_TYPE_IDS,
  getApplianceLabel,
  getRoomLabel,
  ROOM_KEYS,
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
  password: z
    .string()
    .trim()
    .min(1, tMessage("linkDeviceModal:errors.passwordRequired")),
});

interface StepDotsProps {
  currentStep: WizardStep;
}

function StepDots({ currentStep }: StepDotsProps) {
  const { t } = useTranslation("linkDeviceModal");
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <View
      style={styles.stepDots}
      accessibilityLabel={t("step", {
        current: currentIndex + 1,
        total: STEPS.length,
      })}
    >
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
  const { t } = useTranslation("linkDeviceModal");
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
      setTimeout(() => setStep("done"), 2500),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [step]);

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
          result.error.issues[0]?.message ??
            t("errors.passwordRequired"),
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
      name: deviceName.trim() || getApplianceLabel(t, applianceType),
      applianceType,
      roomKey,
    });
    onClose();
  };

  const renderDiscoverStep = () => (
    <>
      <Text style={styles.stepTitle}>{t("discover.title")}</Text>
      <Text style={styles.stepHint}>{t("discover.hint")}</Text>

      {scanning ? (
        <View style={styles.scanningBox}>
          <View style={styles.scannerCircle}>
            <ActivityIndicator
              size="large"
              color={Theme.colors.primary}
            />
          </View>
          <Text style={styles.scanningText}>{t("discover.scanning")}</Text>
        </View>
      ) : (
        <>
          <Text style={styles.blockLabel}>{t("discover.foundTitle")}</Text>
          <View style={styles.optionList}>
            {MOCK_MODULES.map((module) => {
              const selected = module.id === selectedModuleId;

              return (
                <Pressable
                  key={module.id}
                  onPress={() => setSelectedModuleId(module.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={t("moduleLabel", {
                    code: module.code,
                  })}
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
            {t("discover.rescan")}
          </Button>
        </>
      )}
    </>
  );

  const renderApplianceStep = () => (
    <>
      <Text style={styles.stepTitle}>{t("appliance.title")}</Text>
      <Text style={styles.stepHint}>{t("appliance.hint")}</Text>

      <View style={styles.applianceGrid}>
        {APPLIANCE_TYPE_IDS.map((applianceType) => {
          const selected = applianceType === selectedAppliance;

          return (
            <Pressable
              key={applianceType}
              onPress={() => setSelectedAppliance(applianceType)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={getApplianceLabel(t, applianceType)}
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
                {getApplianceLabel(t, applianceType)}
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
      <Text style={styles.stepTitle}>{t("network.title")}</Text>
      <Text style={styles.stepHint}>{t("network.subtitle")}</Text>

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
                    <Text style={styles.openTag}>{t("network.open")}</Text>
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
            label={t("network.passwordLabel")}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            placeholder={t("network.passwordPlaceholder")}
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
      t("connecting.step1", { ssid: selectedNetwork?.ssid ?? "" }),
      t("connecting.step2"),
      t("connecting.step3"),
    ];

    return (
      <>
        <Text style={styles.stepTitle}>{t("connecting.title")}</Text>
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
                        color={Theme.colors.onBrand}
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
        <Text style={styles.doneTitle}>{t("done.title")}</Text>
        <Text style={styles.stepHint}>{t("done.subtitle")}</Text>
      </View>

      <View style={styles.field}>
        <Input
          label={t("done.nameLabel")}
          value={deviceName}
          onChangeText={setDeviceName}
          placeholder={getApplianceLabel(t, selectedAppliance ?? "other")}
          maxLength={40}
          autoCapitalize="sentences"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t("done.roomLabel")}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={roomKey}
            onValueChange={(value) => setRoomKey(String(value) as RoomKey)}
            mode="dropdown"
            style={styles.picker}
            dropdownIconColor={Theme.colors.textSecondary}
          >
            {ROOM_KEYS.map((room) => (
              <Picker.Item
                key={room}
                label={getRoomLabel(t, room)}
                value={room}
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
            {t("buttons.cancel")}
          </Button>
          <Button
            onPress={() => setStep("appliance")}
            disabled={!selectedModuleId}
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
          <Button
            variant="secondary"
            onPress={() => setStep("discover")}
            style={styles.footerButton}
          >
            {t("buttons.back")}
          </Button>
          <Button
            onPress={() => setStep("network")}
            disabled={!selectedAppliance}
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
          <Button
            variant="secondary"
            onPress={() => setStep("appliance")}
            style={styles.footerButton}
          >
            {t("buttons.back")}
          </Button>
          <Button
            onPress={handleConnect}
            disabled={!selectedNetwork}
            style={styles.footerButton}
          >
            {t("buttons.connect")}
          </Button>
        </>
      );
    }

    if (step === "connecting") {
      return (
        <Button variant="secondary" onPress={onClose} style={styles.footerButton}>
          {t("buttons.cancel")}
        </Button>
      );
    }

    return (
      <Button onPress={handleFinish} style={styles.footerButton}>
        {t("buttons.finish")}
      </Button>
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      title={t("title")}
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
