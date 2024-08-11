/** @jsxImportSource nativewind */
import { View } from "react-native";

import { render } from "../test-utils";

import { verifyFlag } from "react-native-css-interop";

test("verifyInstallation", async () => {
  // Render will inject data
  await render(<View className="text-black" />, {
    layers: {
      base: true,
    },
  });

  expect(verifyFlag("nativewind")).toBe(true);
});
