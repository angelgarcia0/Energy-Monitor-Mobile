import { Alert } from "react-native";
import type { TFunction } from "i18next";

/**
 * Pide aceptar los términos y condiciones cuando el servidor responde 428 (cuenta
 * nueva con Google, o una que nunca los aceptó). Resuelve `true` si los acepta.
 */
export function askTermsConsent(t: TFunction): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      t("auth:termsConsent.title"),
      t("auth:termsConsent.message"),
      [
        { text: t("auth:termsConsent.cancel"), style: "cancel", onPress: () => resolve(false) },
        { text: t("auth:termsConsent.accept"), onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
