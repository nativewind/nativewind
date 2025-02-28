/** @jsxImportSource nativewind */
import { View } from "react-native";

import { screen } from "@testing-library/react-native";

import { render } from "../test";

const testID = "react-native-css-interop";

test("@apply", async () => {
  await render(<View testID={testID} className="btn-primary" />, {
    css: `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400;
  }
}
    `,
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    backgroundColor: "#3b82f6",
    borderRadius: 7,
    color: "#ffffff",
    fontWeight: "600",
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 7,
    shadowColor: "#00000059",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 10,
  });
});
