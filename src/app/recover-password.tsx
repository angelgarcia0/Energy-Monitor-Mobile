import { useTheme } from "@/context/ThemeContext";
import { RecoverPasswordScreen } from "@/features/auth/screens/RecoverPasswordScreen/RecoverPasswordScreen";

export default function RecoverPassword() {
  const { currentTheme } = useTheme();

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).
  return <RecoverPasswordScreen key={currentTheme.id} />;
}
