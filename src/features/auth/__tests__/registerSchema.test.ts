import { registerSchema } from "../validation/registerSchema";

const base = {
  name: "Juan",
  lastName: "Cortés",
  email: "juan@example.com",
  password: "Abc123!def456",
  repeatPassword: "Abc123!def456",
  terms: true,
};

const paths = (values: object) => {
  const result = registerSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map((i) => i.path.join("."));
};

describe("registerSchema", () => {
  it("acepta un formulario completo", () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  it("recorta los espacios del nombre y del apellido", () => {
    const result = registerSchema.parse({ ...base, name: "  Juan  ", lastName: " Cortés " });
    expect(result.name).toBe("Juan");
    expect(result.lastName).toBe("Cortés");
  });

  it("rechaza un nombre vacío o de un solo carácter", () => {
    expect(paths({ ...base, name: "" })).toContain("name");
    expect(paths({ ...base, name: "J" })).toContain("name");
  });

  it("rechaza un apellido de más de 100 caracteres", () => {
    expect(paths({ ...base, lastName: "a".repeat(101) })).toContain("lastName");
    expect(paths({ ...base, lastName: "a".repeat(100) })).not.toContain("lastName");
  });

  it("exige el correo", () => {
    expect(paths({ ...base, email: "" })).toContain("email");
  });

  it("rechaza contraseñas distintas y marca el campo de repetición", () => {
    expect(paths({ ...base, repeatPassword: "Otra123!abc456" })).toContain("repeatPassword");
  });

  it("no deja registrarse sin aceptar los términos", () => {
    expect(paths({ ...base, terms: false })).toContain("terms");
  });
});
