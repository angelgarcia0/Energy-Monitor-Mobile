import { useTheme } from "@/context/ThemeContext";
import { VerifyAccountScreen } from "@/features/auth/screens/VerifyAccountScreen/VerifyAccountScreen";

export default function VerifyAccount() {
  const { currentTheme } = useTheme();

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).
  return <VerifyAccountScreen key={currentTheme.id} />;
}
