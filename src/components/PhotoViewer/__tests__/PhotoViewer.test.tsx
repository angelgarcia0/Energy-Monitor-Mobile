import { fireEvent, render } from "@testing-library/react-native";

import { PhotoViewer } from "../PhotoViewer";

/** El visor solo admite imágenes incrustadas: una data URL de ejemplo. */
const DATA_URL = "data:image/png;base64,iVBORw0KGgo=";

const baseProps = {
  visible: true,
  alt: "Ana Pérez",
  closeLabel: "Cerrar foto",
  onClose: jest.fn(),
};

jest.mock("expo-image", () => {
  const { Image } = jest.requireActual<typeof import("react-native")>(
    "react-native",
  );
  return { Image };
});

describe("PhotoViewer", () => {
  it("no pinta nada sin imagen o con una fuente que no sea data URL", async () => {
    const { toJSON } = await render(<PhotoViewer {...baseProps} src={null} />);
    expect(toJSON()).toBeNull();

    const unsafe = await render(
      <PhotoViewer {...baseProps} src="https://ejemplo.invalid/foto.png" />,
    );
    expect(unsafe.toJSON()).toBeNull();
  });

  it("muestra la foto con su texto alternativo y cierra con el botón", async () => {
    const onClose = jest.fn();
    const { getByLabelText } = await render(
      <PhotoViewer {...baseProps} onClose={onClose} src={DATA_URL} />,
    );

    expect(getByLabelText("Ana Pérez")).toBeTruthy();

    await fireEvent.press(getByLabelText("Cerrar foto"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
