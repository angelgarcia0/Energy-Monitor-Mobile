import fs from "fs";
import path from "path";

import { errorMessageKey, type ApiOperation } from "@/services/http/errorMessages";
import { ApiError } from "@/services/http/errors";

import { DEFAULT_LANGUAGE, isSupportedLanguage, LANGUAGES, SUPPORTED_LANGUAGE_IDS } from "../languages";

const root = path.join(__dirname, "..", "locales");
const languages = fs.readdirSync(root);
const namespaces = fs.readdirSync(path.join(root, "en"));

type Json = { [key: string]: Json | string };

const read = (lang: string, file: string): Json =>
  JSON.parse(fs.readFileSync(path.join(root, lang, file), "utf8"));

function leaves(node: Json, prefix = ""): string[] {
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === "string" ? [`${prefix}${key}`] : leaves(value, `${prefix}${key}.`),
  );
}

describe("idiomas soportados", () => {
  it("son español, inglés, portugués y francés, con español por defecto", () => {
    expect([...SUPPORTED_LANGUAGE_IDS].sort()).toEqual(["en", "es", "fr", "pt"]);
    expect(DEFAULT_LANGUAGE).toBe("es");
    expect(LANGUAGES).toHaveLength(4);
  });

  it("isSupportedLanguage solo acepta los cuatro", () => {
    expect(isSupportedLanguage("fr")).toBe(true);
    expect(isSupportedLanguage("de")).toBe(false);
    expect(isSupportedLanguage(null)).toBe(false);
    expect(isSupportedLanguage("")).toBe(false);
  });

  it("hay una carpeta de textos por idioma", () => {
    expect([...languages].sort()).toEqual(["en", "es", "fr", "pt"]);
  });
});

describe("textos por idioma", () => {
  it.each(namespaces)("%s tiene las mismas claves en los cuatro idiomas", (file) => {
    const reference = leaves(read("en", file)).sort();
    for (const lang of languages) {
      expect(leaves(read(lang, file)).sort()).toEqual(reference);
    }
  });

  it("ningún texto está vacío", () => {
    for (const lang of languages) {
      for (const file of namespaces) {
        const json = JSON.stringify(read(lang, file));
        expect(json).not.toMatch(/:\s*""/);
      }
    }
  });
});

describe("claves de error de la API", () => {
  const operations: (ApiOperation | undefined)[] = [
    undefined, "login", "googleLogin", "register", "emailVerify", "emailResend", "passwordForgot",
    "passwordReset", "passwordChange", "accountDelete", "accountDeleteCode", "accountUpdate", "emailUpdate",
    "homeCreate", "homeJoin", "homeLeave", "homeDelete", "memberRemove", "ownershipTransfer",
    "thresholdsUpdate", "deviceLink", "deviceUnlink", "deviceEdit", "deviceReconnect",
  ];
  const statuses = [null, 400, 401, 403, 404, 405, 409, 422, 428, 429, 500, 503];

  it("cada clave que puede devolver existe en los cuatro idiomas", () => {
    const keys = new Set<string>();
    for (const op of operations) for (const status of statuses) keys.add(errorMessageKey(new ApiError(status, "x"), op));
    for (const lang of languages) {
      const available = new Set(leaves(read(lang, "errors.json")));
      for (const key of keys) {
        expect({ lang, key, exists: available.has(key.replace("errors:", "")) }).toEqual({ lang, key, exists: true });
      }
    }
  });
});
