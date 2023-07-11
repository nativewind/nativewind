import {
  createMockComponent,
  resetStyles,
} from "react-native-css-interop/testing-library";
import { renderTailwind } from "../test-utils";

const A = createMockComponent();

afterEach(() => resetStyles());

it("a", () => {
  renderTailwind(<A className="text-white" />);
  expect(A).styleToEqual({ color: "rgba(255, 255, 255, 1)" });
});
