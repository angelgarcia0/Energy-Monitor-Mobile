import { verifyCodeSchema } from "../validation/verifyCodeSchema";

describe("verifyCodeSchema", () => {
  it("acepta seis dígitos", () => {
    expect(verifyCodeSchema.safeParse({ code: "123456" }).success).toBe(true);
    expect(verifyCodeSchema.safeParse({ code: "000000" }).success).toBe(true);
  });

  it.each(["12345", "1234567", "12345a", "12 456", "", "abcdef"])("rechaza %p", (code) => {
    expect(verifyCodeSchema.safeParse({ code }).success).toBe(false);
  });
});
