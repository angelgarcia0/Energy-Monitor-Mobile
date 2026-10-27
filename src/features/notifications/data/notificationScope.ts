/**
 * Alcance del filtro de la bandeja y de sus acciones en bloque: todos los
 * hogares, uno (su id) o la cuenta, que reúne lo que no es de ningún hogar.
 */
export const ALL_SCOPE = "all";
export const ACCOUNT_SCOPE = "account";

export type NotificationScope = string;

export function inScope(item: { homeId: string | null }, scope?: NotificationScope): boolean {
  if (!scope || scope === ALL_SCOPE) return true;
  if (scope === ACCOUNT_SCOPE) return item.homeId == null;
  return item.homeId === scope;
}
