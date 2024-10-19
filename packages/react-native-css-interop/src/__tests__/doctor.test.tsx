/** @jsxImportSource test */
import { registerCSS, verifyData } from "test";

test("verifyData", () => {
  expect(verifyData()).toBe(false);

  registerCSS(`
  .my-class {
    color: hsl(0, 84.2%, 60.2%);
  }`);

  expect(verifyData()).toBe(true);
});

test("verifyJSX", () => {
  // We cannot test this within the JSX file, as Jest doesn't apply the importSource
  // transform for all files

  // @ts-expect-error
  expect(<react-native-css-interop-jsx-pragma-check /> === true).toBeTruthy();
});
