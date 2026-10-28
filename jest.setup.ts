// AsyncStorage no existe fuera del dispositivo: se usa el mock oficial del paquete.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
