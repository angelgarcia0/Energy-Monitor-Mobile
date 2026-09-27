import { useCallback, useState } from "react";

import {
  APPLIANCE_LABEL,
  INITIAL_DEVICES,
  type Device,
} from "../data/deviceMocks";

export type NewDeviceInput = Pick<Device, "applianceType"> &
  Partial<Omit<Device, "id" | "applianceType">>;

export function useDevicesState() {
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);

  const addDevice = useCallback((newDevice: NewDeviceInput) => {
    setDevices((currentDevices) => [
      ...currentDevices,
      {
        id: Date.now(),
        name: newDevice.name?.trim() || APPLIANCE_LABEL[newDevice.applianceType],
        applianceType: newDevice.applianceType,
        roomKey: newDevice.roomKey ?? "livingRoom",
        status: newDevice.status ?? "online",
        signal: newDevice.signal ?? 78,
        consumption: newDevice.consumption ?? 0,
      },
    ]);
  }, []);

  const removeDevice = useCallback((deviceId: number) => {
    setDevices((currentDevices) =>
      currentDevices.filter((device) => device.id !== deviceId),
    );
  }, []);

  return { devices, addDevice, removeDevice };
}
