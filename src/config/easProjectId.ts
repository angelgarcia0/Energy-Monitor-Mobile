/**
 * Identificador del proyecto de Expo, necesario para pedir un token de push.
 *
 * `getExpoPushTokenAsync` lo exige y lanza "Project ID not found" sin él: no hay
 * forma de obtener un token sin uno. No se puede deducir ni dejar por defecto,
 * porque un id inventado simplemente falla contra el relay.
 *
 * Dónde se consigue: expo.dev → el proyecto → "Project settings", o
 * `eas init` una vez. Se escribe en `.env` como `EXPO_PUBLIC_EAS_PROJECT_ID`.
 *
 * Va con prefijo `EXPO_PUBLIC_` a propósito: Expo solo inlina en el bundle las
 * variables así nombradas, y este valor tiene que estar disponible en el
 * dispositivo. No es un secreto — es un identificador de proyecto, público por
 * definición—, al contrario que `EXPO_ACCESS_TOKEN`, que se queda en el
 * backend y nunca debe llegar aquí.
 */
const RAW_PROJECT_ID = process.env.EXPO_PUBLIC_EAS_PROJECT_ID?.trim() ?? "";

/** `""` cuando no está configurado; quien lo use debe comprobarlo antes. */
export const EAS_PROJECT_ID = RAW_PROJECT_ID;

export const HAS_EAS_PROJECT_ID = RAW_PROJECT_ID.length > 0;