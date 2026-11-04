/**
 * Alcance del filtro de la bandeja y de sus acciones en bloque: todos los
 * hogares o uno (su id).
 */
export const ALL_SCOPE = "all";

export type NotificationScope = string;

export function inScope(item: { homeId: string | null }, scope?: NotificationScope): boolean {
  if (!scope || scope === ALL_SCOPE) return true;
  return item.homeId === scope;
}
