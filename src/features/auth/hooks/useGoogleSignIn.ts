import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { GoogleSignInError, signInWithGoogle } from "@/services/auth";
import { errorMessage } from "@/services/http/errorMessages";

/**
 * Botón "Continuar con Google" de las pantallas de login y registro: es el mismo
 * flujo en las dos, porque el servidor crea la cuenta la primera vez.
 *
 * `error` es el texto a mostrar; cerrar el selector de cuentas no es un error.
 */
export function useGoogleSignIn(onSuccess?: () => void) {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const signIn = useCallback(async () => {
    setSubmitting(true);
    setError("");
    try {
      const account = await signInWithGoogle();
      if (!account) {
        setSubmitting(false);
        return;
      }
      router.replace("/dashboard");
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof GoogleSignInError
          ? t(`errors:googleLogin.${err.reason === "notConfigured" ? "unavailable" : err.reason}`)
          : errorMessage(t, err, "googleLogin"),
      );
      setSubmitting(false);
    }
  }, [onSuccess, router, t]);

  return { signIn, submitting, error };
}
