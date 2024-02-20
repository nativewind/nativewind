import { View } from "react-native";
import { createMockComponent, renderTailwind } from "../test-utils";
import { screen } from "@testing-library/react-native";
import { resetStyles } from "react-native-css-interop/testing-library";

const testID = "react-native-css-interop";
const A = createMockComponent(View);

beforeEach(() => resetStyles());

test("@apply", async () => {
  await renderTailwind(<A testID={testID} className="btn-primary" />, {
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
    backgroundColor: "rgba(59, 130, 246, 1)",
    borderRadius: 7,
    color: "rgba(255, 255, 255, 1)",
    fontWeight: "600",
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 7,
    shadowColor: "rgba(0, 0, 0, 0.3490196168422699)",
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 10,
  });
});
