import type { ApplianceTypeResponse, HomeDevice } from "@/services/devices";

import {
  applianceTypeIdFor,
  getLocationLabel,
  toDevice,
  uiApplianceType,
  uiApplianceTypeById,
} from "../deviceTypes";

/** Instante fijo: la conectividad se mide contra `now`, no contra el reloj. */
const NOW = Date.parse("2026-11-01T12:00:00.000Z");

const seenAt = (ageMs: number) => new Date(NOW - ageMs).toISOString();

const baseDevice = (overrides: Partial<HomeDevice> = {}): HomeDevice => ({
  idDevice: "dev-001",
  name: "Nevera cocina",
  applianceTypeId: "appl000001",
  applianceType: "refrigerator",
  location: "kitchen",
  installationDate: null,
  deviceCode: "ABC123",
  status: "ONLINE",
  signalStrength: -75,
  lastSeen: seenAt(10_000),
  ...overrides,
});

describe("uiApplianceType", () => {
  it("traduce los nombres del catálogo a las claves de la UI", () => {
    expect(uiApplianceType("refrigerator")).toBe("fridge");
    expect(uiApplianceType("washing_machine")).toBe("washer");
    expect(uiApplianceType("air_conditioner")).toBe("ac");
    expect(uiApplianceType("water_heater")).toBe("waterHeater");
  });

  it("cae a other cuando el nombre no está en el mapa", () => {
    expect(uiApplianceType("dishwasher")).toBe("other");
    expect(uiApplianceType("")).toBe("other");
  });
});

describe("uiApplianceTypeById", () => {
  const catalog: ApplianceTypeResponse[] = [
    { idApplianceType: "appl000004", name: "washing_machine" },
    { idApplianceType: "appl000001", name: "refrigerator" },
  ];

  it("resuelve el id a través del catálogo", () => {
    expect(uiApplianceTypeById("appl000004", catalog)).toBe("washer");
  });

  it("usa other si el id no está en el catálogo", () => {
    expect(uiApplianceTypeById("no-existe", catalog)).toBe("other");
    expect(uiApplianceTypeById("appl000004", [])).toBe("other");
  });
});

describe("applianceTypeIdFor", () => {
  it("prefiere el id del catálogo cuando lo hay", () => {
    const catalog: ApplianceTypeResponse[] = [
      { idApplianceType: "custom-washer", name: "washing_machine" },
    ];
    expect(applianceTypeIdFor("washer", catalog)).toBe("custom-washer");
  });

  it("usa el id fijo del seed cuando el catálogo no llega", () => {
    expect(applianceTypeIdFor("washer", [])).toBe("appl000004");
    expect(applianceTypeIdFor("other", [])).toBe("appl000009");
  });
});

describe("toDevice — conectividad", () => {
  it("está online si lastSeen es reciente", () => {
    expect(toDevice(baseDevice(), undefined, NOW).status).toBe("online");
  });

  it("está comprobando cuando el módulo lleva más de 75 s sin publicar", () => {
    const device = baseDevice({ lastSeen: seenAt(80_000) });
    expect(toDevice(device, undefined, NOW).status).toBe("checking");
  });

  it("está offline a partir de 150 s, con status OFFLINE o sin lastSeen", () => {
    expect(
      toDevice(baseDevice({ lastSeen: seenAt(151_000) }), undefined, NOW).status,
    ).toBe("offline");
    expect(
      toDevice(baseDevice({ status: "OFFLINE" }), undefined, NOW).status,
    ).toBe("offline");
    expect(
      toDevice(baseDevice({ lastSeen: null }), undefined, NOW).status,
    ).toBe("offline");
  });
});

describe("toDevice — fila", () => {
  it("une el consumo del resumen con la unidad correcta (W → kW)", () => {
    const row = toDevice(
      baseDevice(),
      { currentPower: 1234, todayEnergy: 2.5 },
      NOW,
    );
    expect(row.consumption).toBe(1.234);
    expect(row.todayEnergy).toBe(2.5);
  });

  it("consumption es null sin resumen o estando offline, pero hoy se pinta", () => {
    expect(toDevice(baseDevice(), undefined, NOW).consumption).toBeNull();

    const offline = toDevice(
      baseDevice({ status: "OFFLINE" }),
      { currentPower: 500, todayEnergy: 1 },
      NOW,
    );
    expect(offline.consumption).toBeNull();
    expect(offline.todayEnergy).toBe(1);
  });

  it("hoy sin resumen empieza en 0", () => {
    expect(toDevice(baseDevice(), undefined, NOW).todayEnergy).toBe(0);
  });

  it("señal: porcentaje del dBm y 0 cuando está offline", () => {
    expect(
      toDevice(baseDevice({ signalStrength: -75 }), undefined, NOW).signal,
    ).toBe(50);
    expect(
      toDevice(
        baseDevice({ status: "OFFLINE", signalStrength: -60 }),
        undefined,
        NOW,
      ).signal,
    ).toBe(0);
  });

  it("ubicación: clave de habitación si lo es, texto libre si no", () => {
    const keyed = toDevice(baseDevice({ location: "kitchen" }), undefined, NOW);
    expect(keyed.roomKey).toBe("kitchen");

    const free = toDevice(
      baseDevice({ location: "Cuarto de máquinas" }),
      undefined,
      NOW,
    );
    expect(free.roomKey).toBeNull();
    expect(free.location).toBe("Cuarto de máquinas");

    const none = toDevice(baseDevice({ location: null }), undefined, NOW);
    expect(none.roomKey).toBeNull();
    expect(none.location).toBe("");
  });
});

describe("getLocationLabel", () => {
  const t = (key: string) => `«${key}»`;

  it("traduce la clave de habitación", () => {
    const keyed = toDevice(baseDevice({ location: "kitchen" }), undefined, NOW);
    expect(getLocationLabel(t, keyed)).toBe("«devices:rooms.kitchen»");
  });

  it("deja el texto libre tal cual", () => {
    const free = toDevice(
      baseDevice({ location: "Sótano" }),
      undefined,
      NOW,
    );
    expect(getLocationLabel(t, free)).toBe("Sótano");
  });
});
