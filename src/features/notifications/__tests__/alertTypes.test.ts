import fs from "fs";
import path from "path";

import type { Alert } from "@/services/alerts";

import { toUiAlert } from "../data/alertTypes";

const base: Alert = {
  idAlert: "a-1",
  homeId: "h-1",
  deviceId: "d-1",
  type: "THRESHOLD",
  messageKey: "alert.threshold.high",
  dateTime: "2026-10-28T12:00:00Z",
  alertStatus: "PENDING",
  consumptionLevelId: null,
  measurementId: null,
};

const make = (patch: Partial<Alert>): Alert => ({ ...base, ...patch });

describe("toUiAlert", () => {
  it("traduce alert.anomaly.device a threshold.anomaly (no a threshold.high)", () => {
    const ui = toUiAlert(make({ messageKey: "alert.anomaly.device" }), "Casa");

    expect(ui.key).toBe("threshold.anomaly");
    expect(ui.type).toBe("threshold");
    expect(ui.severity).toBe("warning");
  });

  it("los demás umbrales siguen mapeando a su clave", () => {
    expect(toUiAlert(make({}), "Casa").key).toBe("threshold.high");
    expect(toUiAlert(make({ messageKey: "alert.threshold.critical" }), "Casa").key).toBe(
      "threshold.critical",
    );
  });

  it("mapea el resto de tipos igual que la web", () => {
    expect(
      toUiAlert(make({ type: "CONNECTIVITY", messageKey: "alert.connectivity.offline" }), "Casa").key,
    ).toBe("connectivity.deviceOffline");
    expect(toUiAlert(make({ type: "DEVICE", messageKey: "alert.device.linked" }), "Casa").key).toBe(
      "device.linked",
    );
    expect(toUiAlert(make({ type: "LIMIT", messageKey: "alert.limit.daily" }), "Casa").key).toBe(
      "limit.daily",
    );
    expect(toUiAlert(make({ type: "LIMIT", messageKey: "alert.limit.monthly" }), "Casa").key).toBe(
      "limit.monthly",
    );
  });

  it("solo DEVICE es informativo; LIMIT y críticas son críticas, el resto warning", () => {
    expect(toUiAlert(make({ type: "DEVICE" }), "Casa").severity).toBe("info");
    expect(toUiAlert(make({ type: "LIMIT" }), "Casa").severity).toBe("critical");
    expect(toUiAlert(make({ messageKey: "alert.threshold.critical" }), "Casa").severity).toBe(
      "critical",
    );
    expect(toUiAlert(make({ messageKey: "alert.anomaly.device" }), "Casa").severity).toBe("warning");
  });

  it("solo DEVICE no se resuelve solo", () => {
    expect(toUiAlert(make({ type: "DEVICE" }), "Casa").autoResolved).toBe(false);
    expect(toUiAlert(make({}), "Casa").autoResolved).toBe(true);
    expect(toUiAlert(make({ messageKey: "alert.anomaly.device" }), "Casa").autoResolved).toBe(true);
  });

  it("refleja el estado de resolución del backend", () => {
    expect(toUiAlert(make({}), "Casa").resolved).toBe(false);
    expect(toUiAlert(make({ alertStatus: "RESOLVED" }), "Casa").resolved).toBe(true);
  });
});

describe("claves que usa toUiAlert", () => {
  const root = path.join(__dirname, "..", "..", "..", "i18n", "locales");
  const languages = fs.readdirSync(root);
  const keys = [
    "threshold.anomaly",
    "threshold.high",
    "threshold.critical",
    "connectivity.deviceOffline",
    "device.linked",
    "limit.daily",
    "limit.monthly",
  ];

  it.each(languages)("%s tiene título y mensaje para cada clave", (lang) => {
    const json = JSON.parse(
      fs.readFileSync(path.join(root, lang, "notifications.json"), "utf8"),
    ) as Record<string, Record<string, { title: string; message: string }>>;

    for (const key of keys) {
      const [group, name] = key.split(".") as [string, string];
      expect({ lang, key, ok: !!json[group]?.[name]?.title && !!json[group]?.[name]?.message }).toEqual({
        lang,
        key,
        ok: true,
      });
    }
  });
});
