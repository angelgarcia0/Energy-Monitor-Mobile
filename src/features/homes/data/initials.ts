/**
 * El backend manda `name` y `lastName` por separado; las iniciales se sacan de
 * los dos para no perder la que aportaba el apellido dentro de un nombre único.
 */
export const getInitials = (name = "", lastName = "") =>
  [name, lastName]
    .map((word) => word.trim().split(" ")[0]?.[0]?.toUpperCase() ?? "")
    .join("");