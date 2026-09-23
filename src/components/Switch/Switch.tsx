import { Theme } from "@/constants/theme";
import { Switch as NativeSwitch, type SwitchProps } from "react-native";

export function Switch({ value, onValueChange, ...rest }: SwitchProps) {
  return (
    <NativeSwitch
      value={value}
      onValueChange={onValueChange}
      trackColor={{
        false: Theme.colors.border,
        true: Theme.colors.primary,
      }}
      thumbColor="#FFFFFF"
      ios_backgroundColor={Theme.colors.border}
      {...rest}
    />
  );
}