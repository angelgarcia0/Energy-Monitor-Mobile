import { useTheme } from "@/context/ThemeContext";
import { VerifyRecoverPasswordScreen } from "@/features/auth/screens/VerifyRecoverPasswordScreen/VerifyRecoverPasswordScreen";

export default function VerifyRecoverPassword() {
  const { currentTheme } = useTheme();

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).
  return <VerifyRecoverPasswordScreen key={currentTheme.id} />;
}
