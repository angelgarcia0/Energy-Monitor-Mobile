import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Modal, Pressable, View } from "react-native";

import { Theme } from "@/constants/theme";
import { safeImage } from "./safeImage";
import { styles } from "./PhotoViewer.styles";

export interface PhotoViewerProps {
  visible: boolean;
  /** `data:` de la foto; si no es una imagen segura, no se abre nada. */
  src: string | null;
  /** Texto alternativo: la persona dueña de la foto. */
  alt: string;
  closeLabel: string;
  onClose: () => void;
}

/**
 * Foto ampliada a pantalla completa sobre la propia app, sin salir de ella.
 * Espejo del `PhotoViewer` compartido de la web: solo admite imágenes
 * incrustadas seguras (data URL) y se cierra con el botón o con el botón
 * atrás del sistema.
 */
export function PhotoViewer({
  visible,
  src,
  alt,
  closeLabel,
  onClose,
}: PhotoViewerProps) {
  const image = safeImage(src);
  if (!image) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={closeLabel}
          hitSlop={8}
          style={styles.close}
        >
          <Ionicons
            name="close"
            size={Theme.typography.size.xl}
            color={Theme.colors.onBrand}
          />
        </Pressable>

        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit="contain"
          accessibilityLabel={alt}
          transition={120}
        />
      </View>
    </Modal>
  );
}
