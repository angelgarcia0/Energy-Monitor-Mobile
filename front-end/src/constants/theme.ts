import { Colors } from "./colors";
import { Spacing } from "./spacing";
import { Typography } from "./typography";

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  typography: Typography,

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
  },

  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 15,
      elevation: 10,
    },
  },
};

export default Theme;
