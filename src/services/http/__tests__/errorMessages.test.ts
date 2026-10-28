import { ApiError } from "../errors";
import { errorMessage, errorMessageKey, errorMessageValues } from "../errorMessages";

const err = (status: number | null, retryAfter: number | null = null) => new ApiError(status, "x", retryAfter);

describe("errorMessageKey", () => {
  it.each(["login", "googleLogin", "register"] as const)("%s: 428 pide aceptar los términos", (op) => {
    expect(errorMessageKey(err(428), op)).toBe("errors:terms.required");
  });

  it("registro: distingue correo inválido, repetido y contraseña", () => {
    expect(errorMessageKey(err(400), "register")).toBe("errors:register.invalidEmail");
    expect(errorMessageKey(err(409), "register")).toBe("errors:register.emailTaken");
    expect(errorMessageKey(err(422), "register")).toBe("errors:password.policy");
  });

  it("borrado de cuenta: código, contraseña, propietario único y límite", () => {
    expect(errorMessageKey(err(400), "accountDelete")).toBe("errors:accountDelete.wrongCode");
    expect(errorMessageKey(err(401), "accountDelete")).toBe("errors:accountDelete.wrongPassword");
    expect(errorMessageKey(err(409), "accountDelete")).toBe("errors:accountDelete.lastOwner");
    expect(errorMessageKey(err(429), "accountDelete")).toBe("errors:generic.rateLimited");
  });

  it("código de borrado: 503 avisa que el correo no está disponible", () => {
    expect(errorMessageKey(err(503), "accountDeleteCode")).toBe("errors:accountDeleteCode.unavailable");
  });

  it("sin conexión usa la clave de red en cualquier operación", () => {
    expect(errorMessageKey(err(null), "login")).toBe("errors:generic.network");
    expect(errorMessageKey(err(null))).toBe("errors:generic.network");
  });

  it("un status sin clave propia cae en el default de la operación y luego en el genérico", () => {
    expect(errorMessageKey(err(500), "passwordChange")).toBe("errors:passwordChange.failed");
    expect(errorMessageKey(err(404))).toBe("errors:generic.notFound");
    expect(errorMessageKey(err(500))).toBe("errors:generic.server");
  });

  it("acepta el error crudo de axios", () => {
    expect(errorMessageKey({ response: { status: 401 } }, "login")).toBe("errors:login.invalidCredentials");
  });
});

describe("errorMessageValues", () => {
  it("convierte Retry-After en minutos, hacia arriba", () => {
    expect(errorMessageValues(err(429, 120))).toEqual({ minutes: 2 });
    expect(errorMessageValues(err(429, 61))).toEqual({ minutes: 2 });
  });

  it("usa 15 minutos si no hay Retry-After", () => {
    expect(errorMessageValues(err(429))).toEqual({ minutes: 15 });
  });
});

describe("errorMessage", () => {
  it("pasa la clave y los valores al traductor", () => {
    const t = jest.fn(() => "texto");
    expect(errorMessage(t, err(429, 300), "emailVerify")).toBe("texto");
    expect(t).toHaveBeenCalledWith("errors:generic.rateLimited", { minutes: 5 });
  });
});
