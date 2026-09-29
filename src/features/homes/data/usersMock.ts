export interface ProjectUser {
  id: number;
  name: string;
  email: string;
  role: "owner" | "member";
}

export const INITIAL_USERS: ProjectUser[] = [
  { id: 1, name: "Carlos García", email: "carlos.garcia@email.com", role: "owner" },
  { id: 2, name: "Ana Martínez", email: "ana.m@email.com", role: "member" },
  { id: 3, name: "Luis Pérez", email: "luis.perez@email.com", role: "member" },
  { id: 4, name: "Sofía Ramos", email: "sofia.ramos@empresa.co", role: "member" },
];

export const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");