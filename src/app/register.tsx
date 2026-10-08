import { useTheme } from "@/context/ThemeContext";
import { RegisterScreen } from "@/features/auth/screens/RegisterScreen/RegisterScreen";

export default function Register() {
  const { currentTheme } = useTheme();

  // La key remonta la pantalla al cambiar de paleta para que los estilos
  // reconstruidos se apliquen (ver useTheme).
  return <RegisterScreen key={currentTheme.id} />;
}
