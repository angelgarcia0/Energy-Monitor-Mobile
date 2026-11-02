import { enablePushOnThisDevice } from "../pushRegistration";

const mockRequestPermission = jest.fn();
const mockGetToken = jest.fn();
const mockRegisterDevice = jest.fn();

/** Lo que "el sistema" devuelve al leer el permiso (lo decide el test). */
let mockPermissionStatus = "undetermined";

/** Se manipula por test: la build puede (no) traer `EXPO_PUBLIC_EAS_PROJECT_ID`. */
let mockHasProjectId = true;

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(async () => ({ status: mockPermissionStatus })),
  requestPermissionsAsync: (...args: unknown[]) => mockRequestPermission(...args),
  getExpoPushTokenAsync: (...args: unknown[]) => mockGetToken(...args),
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  AndroidImportance: { HIGH: 4 },
}));

jest.mock("../pushDeviceApi", () => ({
  registerDevice: (...args: unknown[]) => mockRegisterDevice(...args),
  unregisterDevice: jest.fn(),
}));

jest.mock("@/config/easProjectId", () => ({
  EAS_PROJECT_ID: "project-test",
  get HAS_EAS_PROJECT_ID() {
    return mockHasProjectId;
  },
}));

describe("enablePushOnThisDevice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHasProjectId = true;
    mockPermissionStatus = "undetermined";
    mockRequestPermission.mockImplementation(async () => {
      // El sistema persiste la decisión: tras preguntar, leer el permiso
      // devuelve lo que se concedió (es lo que ve `hasPermission` después).
      mockPermissionStatus = "granted";
      return { status: "granted" };
    });
    mockGetToken.mockResolvedValue({ data: "ExpoPushToken[test]" });
    mockRegisterDevice.mockResolvedValue(undefined);
  });

  it("informa de build sin proyecto antes de tocar el permiso", async () => {
    mockHasProjectId = false;

    await expect(enablePushOnThisDevice()).resolves.toBe("missingProjectId");
    expect(mockRequestPermission).not.toHaveBeenCalled();
    expect(mockRegisterDevice).not.toHaveBeenCalled();
  });

  it("permissionDenied cuando el usuario no concede el permiso", async () => {
    mockRequestPermission.mockImplementation(async () => {
      mockPermissionStatus = "denied";
      return { status: "denied" };
    });

    await expect(enablePushOnThisDevice()).resolves.toBe("permissionDenied");
    expect(mockRegisterDevice).not.toHaveBeenCalled();
  });

  it("registered cuando hay permiso y el token se da de alta", async () => {
    await expect(enablePushOnThisDevice()).resolves.toBe("registered");
    expect(mockRegisterDevice).toHaveBeenCalledWith({
      token: "ExpoPushToken[test]",
      platform: expect.stringMatching(/^(IOS|ANDROID)$/),
    });
  });

  it("failed si el alta en el backend falla (red o 5xx)", async () => {
    mockRegisterDevice.mockRejectedValue(new Error("503"));

    await expect(enablePushOnThisDevice()).resolves.toBe("failed");
  });
});
