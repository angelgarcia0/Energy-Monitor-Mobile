import { ApiError, normalizeError } from "../errors";

describe("normalizeError", () => {
  it("conserva un ApiError tal cual", () => {
    const error = new ApiError(409, "HTTP 409");
    expect(normalizeError(error)).toBe(error);
  });

  it("toma el status de una respuesta de axios y descarta el cuerpo", () => {
    const result = normalizeError({ response: { status: 428, data: { message: "texto del servidor" } } });
    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(428);
    expect(result.message).toBe("HTTP 428");
  });

  it("lee Retry-After en un 429", () => {
    const result = normalizeError({ response: { status: 429, headers: { "retry-after": "120" } } });
    expect(result.status).toBe(429);
    expect(result.retryAfter).toBe(120);
  });

  it("usa 900 segundos si el 429 no trae Retry-After válido", () => {
    expect(normalizeError({ response: { status: 429, headers: {} } }).retryAfter).toBe(900);
    expect(normalizeError({ response: { status: 429, headers: { "retry-after": "abc" } } }).retryAfter).toBe(900);
  });

  it("marca la falta de conexión con status nulo", () => {
    expect(normalizeError({ request: {} }).status).toBeNull();
    expect(normalizeError({ code: "ERR_NETWORK" }).message).toBe("Network error");
  });

  it("devuelve un error genérico para valores desconocidos", () => {
    expect(normalizeError(undefined).message).toBe("Unexpected error");
    expect(normalizeError("falla").status).toBeNull();
  });
});
