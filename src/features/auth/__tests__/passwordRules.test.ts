import { passwordField } from "../validation/passwordRules";

const valid = "Abc123!def456";

describe("passwordField", () => {
  it("acepta una contraseña que cumple todas las reglas", () => {
    expect(passwordField.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["menos de 8 caracteres", "Ab1!c2d"],
    ["más de 64 caracteres", "Abc123!".repeat(10)],
    ["sin mayúscula", "abc123!def456"],
    ["con menos de 3 minúsculas", "A1b2!3c4"],
    ["con menos de 3 números", "Abcdef!12ghi"],
    ["sin carácter especial", "Abc123def456"],
  ])("rechaza %s", (_name, value) => {
    expect(passwordField.safeParse(value).success).toBe(false);
  });
});
