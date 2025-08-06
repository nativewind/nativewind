import { verifyFlag } from "react-native-css-interop";
import { View } from "react-native-css/components";

import { render } from "../test-utils";

test("verifyInstallation", async () => {
  // Render will inject data
  await render(<View className="text-black" />);

  expect(verifyFlag("nativewind")).toBe(true);
});
