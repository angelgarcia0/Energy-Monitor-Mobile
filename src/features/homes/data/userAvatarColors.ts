import { Theme } from "@/constants/theme";
import type { ProjectUser } from "./usersMock";

export interface AvatarColor {
  background: string;
  text: string;
}

// Paleta cíclica de avatares y badges de rol (dato de dominio, no token de UI al 100%).
// blue (#e6f1fb/#185fa5) y purple (#eeedfe/#534ab7) no tienen token en Theme, por eso
// viven aquí como constantes; el resto se resuelve en cada llamada para que los avatares
// acompañen a la paleta elegida en Ajustes → Temas.
const OWNER_COLOR: AvatarColor = { background: "#e6f1fb", text: "#185fa5" };
const GUEST_COLOR: AvatarColor = { background: "#eeedfe", text: "#534ab7" };

const AVATAR_COLOR_COUNT = 4;

export const getRoleBadgeColor = (role: ProjectUser["role"]): AvatarColor =>
  role === "owner"
    ? OWNER_COLOR
    : { background: Theme.colors.successSoft, text: Theme.colors.successText };

export const getAvatarColor = (index: number): AvatarColor => {
  switch (index % AVATAR_COLOR_COUNT) {
    case 0:
      return getRoleBadgeColor("owner");
    case 1:
      return getRoleBadgeColor("member");
    case 2:
      return { background: Theme.colors.warningSoft, text: Theme.colors.warningText };
    default:
      return GUEST_COLOR;
  }
};