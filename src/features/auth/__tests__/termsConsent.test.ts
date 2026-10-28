import { Alert } from "react-native";

import { askTermsConsent } from "../service/termsConsent";

const t = ((key: string) => key) as never;

type Button = { text: string; onPress?: () => void };
type Options = { onDismiss?: () => void };

function lastAlert() {
  const call = jest.spyOn(Alert, "alert").mock.calls.at(-1)!;
  return { buttons: call[2] as Button[], options: call[3] as Options };
}

describe("askTermsConsent", () => {
  beforeEach(() => jest.spyOn(Alert, "alert").mockImplementation(() => undefined));
  afterEach(() => jest.restoreAllMocks());

  it("muestra el título y el mensaje de los términos", () => {
    void askTermsConsent(t);
    const call = jest.spyOn(Alert, "alert").mock.calls.at(-1)!;
    expect(call[0]).toBe("auth:termsConsent.title");
    expect(call[1]).toBe("auth:termsConsent.message");
  });

  it("resuelve true al aceptar", async () => {
    const promise = askTermsConsent(t);
    lastAlert().buttons.find((b) => b.text === "auth:termsConsent.accept")!.onPress!();
    await expect(promise).resolves.toBe(true);
  });

  it("resuelve false al cancelar", async () => {
    const promise = askTermsConsent(t);
    lastAlert().buttons.find((b) => b.text === "auth:termsConsent.cancel")!.onPress!();
    await expect(promise).resolves.toBe(false);
  });

  it("resuelve false si se descarta el aviso", async () => {
    const promise = askTermsConsent(t);
    lastAlert().options.onDismiss!();
    await expect(promise).resolves.toBe(false);
  });
});
