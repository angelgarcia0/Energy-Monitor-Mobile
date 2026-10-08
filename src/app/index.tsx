import { useTheme } from "@/context/ThemeContext";
import { LoginScreen } from "@/features/auth/screens/LoginScreen/LoginScreen";

export default function Index() {
  const { currentTheme } = useTheme();

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).
  return <LoginScreen key={currentTheme.id} />;
}
