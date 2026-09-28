import { useCallback, useState } from "react";

import { DEFAULT_THRESHOLDS, type Thresholds } from "../data/thresholds";

export function useThresholdsState() {
  const [thresholds, setThresholds] = useState<Thresholds>({
    ...DEFAULT_THRESHOLDS,
    useDefaults: true,
  });

  const saveThresholds = useCallback((next: Thresholds) => {
    setThresholds(next);
  }, []);

  return { thresholds, saveThresholds };
}
