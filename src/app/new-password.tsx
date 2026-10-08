import { useTheme } from "@/context/ThemeContext";
import { NewPasswordScreen } from "@/features/auth/screens/NewPasswordScreen/NewPasswordScreen";

export default function NewPassword() {
  const { currentTheme } = useTheme();

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).
  return <NewPasswordScreen key={currentTheme.id} />;
}
