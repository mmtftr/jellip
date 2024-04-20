import { config } from "@tamagui/config/v3";
import { createAnimations } from "@tamagui/animations-moti";

import { createTamagui } from "tamagui";

import { Easing } from "react-native-reanimated";

const animations = createAnimations({
  superfastTransform: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
    transform: {
      stiffness: 1000,
    },
  },
  fast: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
});

// you usually export this from a tamagui.config.ts file
export const tamaguiConfig = createTamagui({
  ...config,
  animations,
});

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig;
declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}
