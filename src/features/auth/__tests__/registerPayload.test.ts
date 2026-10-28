import { toRegisterPayload } from "../service/registerPayload";

describe("toRegisterPayload", () => {
  const values = {
    name: "  Juan ",
    lastName: " Cortés  ",
    email: "  juan@example.com ",
    password: "Abc123!def456",
    repeatPassword: "Abc123!def456",
    terms: true,
  };

  it("envía solo los campos del contrato, recortados, y acepta los términos", () => {
    expect(toRegisterPayload(values)).toEqual({
      email: "juan@example.com",
      password: "Abc123!def456",
      name: "Juan",
      lastName: "Cortés",
      acceptTerms: true,
    });
  });

  it("no incluye los controles del formulario", () => {
    const payload = toRegisterPayload(values) as unknown as Record<string, unknown>;
    expect(payload).not.toHaveProperty("repeatPassword");
    expect(payload).not.toHaveProperty("terms");
  });

  it("no recorta la contraseña", () => {
    const payload = toRegisterPayload({ ...values, password: " Abc123!def456 ", repeatPassword: " Abc123!def456 " });
    expect(payload.password).toBe(" Abc123!def456 ");
  });
});
