import { View } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { resetStyles } from "react-native-css-interop/testing-library";
import { screen } from "@testing-library/react-native";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("Using css variables", async () => {
  // https://tailwindcss.com/docs/customizing-colors#using-css-variables
  await renderTailwind(<A testID={testID} className="text-primary" />, {
    css: `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base {
        :root {
          --color-primary: 255 115 179;
          --color-secondary: 111 114 185;
        }
      }
    `,
    config: {
      theme: {
        colors: {
          primary: "rgb(var(--color-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        },
      },
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});
