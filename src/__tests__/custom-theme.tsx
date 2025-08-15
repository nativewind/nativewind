import { Appearance } from "react-native";

import { act, screen } from "@testing-library/react-native";
import { View } from "react-native-css/components";

import { render } from "../test-utils";

const testID = "react-native-css-interop";

test("Using css variables", async () => {
  // https://tailwindcss.com/docs/customizing-colors#using-css-variables
  await render(<View testID={testID} className="text-primary" />, {
    css: `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base {
        :root {
          --color-primary: 255 115 179;
        }
        .dark:root {
          --color-primary: 155 100 255;
        }
      }
    `,
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(255, 115, 179, 1)" });

  act(() => Appearance.setColorScheme("dark"));

  expect(component).toHaveStyle({ color: "rgba(155, 100, 255, 1)" });
});
