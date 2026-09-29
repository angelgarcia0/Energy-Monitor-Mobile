import { Theme } from "@/constants/theme";
import type { ProjectUser } from "./usersMock";

export interface AvatarColor {
  background: string;
  text: string;
}

// Paleta cíclica de avatares y badges de rol (dato de dominio, no token de UI al 100%).
// blue (#e6f1fb/#185fa5) y purple (#eeedfe/#534ab7) no tienen token en Theme, por eso
// viven aquí como constantes; member reutiliza los tokens successSoft/successText.
export const ROLE_BADGE_COLORS: Record<ProjectUser["role"], AvatarColor> = {
  owner: { background: "#e6f1fb", text: "#185fa5" },
  member: {
    background: Theme.colors.successSoft,
    text: Theme.colors.successText,
  },
};

export const AVATAR_COLORS: AvatarColor[] = [
  ROLE_BADGE_COLORS.owner,
  ROLE_BADGE_COLORS.member,
  {
    background: Theme.colors.warningSoft,
    text: Theme.colors.warningText,
  },
  { background: "#eeedfe", text: "#534ab7" },
];

export const getAvatarColor = (index: number) =>
  AVATAR_COLORS[index % AVATAR_COLORS.length];