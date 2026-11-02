/** Solo se muestran imágenes incrustadas (data URL) de tipos de imagen conocidos. */
export const SAFE_IMAGE = /^data:image\/(jpeg|png|webp|gif);/i;

/** @returns la imagen si es segura de mostrar; null si falta o no es una imagen */
export const safeImage = (src: string | null | undefined): string | null =>
  typeof src === "string" && SAFE_IMAGE.test(src) ? src : null;
