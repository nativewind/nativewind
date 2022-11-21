import { variants } from "../src";

test("default only", () => {
  const result = variants("text-base")();

  expect(result).toEqual("text-base");
});

test("default options", () => {
  const result = variants({
    className: "text-base",
  })();

  expect(result).toEqual("text-base");
});

test("variants", () => {
  const result = variants({
    variants: {
      size: {
        large: "text-lg",
        small: "text-sm",
      },
      color: {
        red: "text-red-500",
        blue: "text-blue-500",
      },
    },
    className: "text-base",
  })({ size: "large", color: "blue" });

  expect(result).toEqual("text-base text-lg text-blue-500");
});

test.only("default variants", () => {
  const result = variants({
    variants: {
      size: {
        large: "text-lg",
        small: "text-sm",
      },
      color: {
        red: "text-red-500",
        blue: "text-blue-500",
      },
    },
    className: "text-base",
    defaultProps: {
      size: "large",
      color: "blue",
    },
  })({ size: "small" });

  expect(result).toEqual("text-base text-sm text-blue-500");
});
