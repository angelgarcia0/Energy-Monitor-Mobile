import type { HomeType } from "@/services/home";

/**
 * Catálogo de tipos de hogar compartido por el modal de creación y el detalle.
 *
 * `id` es `id_home_type` y `key` es `name` del seed del backend
 * (`home-005-seed-home-type`): **no son lo mismo**. `POST /homes` espera el id
 * y el nombre es lo que indexa las traducciones (`createHomeModal:homeTypes`)
 * y el ícono, así que el cliente tiene que traducir de uno a otro.
 */
export const HOME_TYPES: { id: string; key: string }[] = [
  { id: "hous000001", key: "house" },
  { id: "apar000001", key: "apartment" },
  { id: "stud000001", key: "studio" },
  { id: "coun000001", key: "country_house" },
  { id: "cabi000001", key: "cabin" },
  { id: "othe000001", key: "other" },
];

/** Un tipo que no está en el catálogo se dibuja con el ícono genérico. */
export const HOME_TYPE_IDS = HOME_TYPES.map(({ id }) => id);

/**
 * `other` es el único tipo que dispara un campo de texto aparte: el backend no
 * tiene dónde guardar un tipo escrito por el usuario, así que ese texto se
 * guarda en `description`.
 */
export const OTHER_HOME_TYPE_ID = "othe000001";

/** `id_home_type` → clave de traducción. `undefined` si el backend agrega tipos. */
export function homeTypeKey(idHomeType: string | undefined): string | undefined {
  return HOME_TYPES.find(({ id }) => id === idHomeType)?.key;
}

/** `name` (el `name` del backend) → clave de traducción, para pintar por nombre. */
export function homeTypeKeyByName(name: string): string | undefined {
  return HOME_TYPES.find(({ key }) => key === name)?.key;
}

/**
 * Etiqueta de un tipo de hogar ya resuelto contra el catálogo del backend.
 *
 * Si el backend agregan tipos y el cliente no los conoce, se muestra el `name`
 * crudo en vez de un hueco: un tipo sin nombre es peor que uno sin traducir.
 */
export function homeTypeLabel(
  t: (key: string) => string,
  idHomeType: string | undefined,
  catalog: HomeType[],
): string {
  if (!idHomeType) return "";
  const name = catalog.find((type) => type.idHomeType === idHomeType)?.name;
  const key =
    homeTypeKey(idHomeType) ?? (name ? homeTypeKeyByName(name) : undefined);
  return key ? t(`createHomeModal:homeTypes.${key}`) : (name ?? "");
}

/**
 * El backend no garantiza el orden de `GET /home-types`, así que se ordena
 * como el catálogo y "other" queda siempre al final. Un tipo desconocido va
 * justo antes de "other" para no abrir la lista con algo raro.
 */
export function sortHomeTypes(types: HomeType[]): HomeType[] {
  const rank = ({ name }: HomeType) => {
    if (name === "other") return Infinity;
    const index = HOME_TYPES.findIndex(({ key }) => key === name);
    return index === -1 ? HOME_TYPES.length : index;
  };
  return [...types].sort((a, b) => rank(a) - rank(b));
}