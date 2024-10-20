/** @jsxImportSource nativewind */
import { View } from "react-native";

import { verifyFlag } from "react-native-css-interop";

import { render } from "../test";

test("verifyInstallation", async () => {
  // Render will inject data
  await render(<View className="text-black" />);

  expect(verifyFlag("nativewind")).toBe(true);
});
