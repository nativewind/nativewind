import { NativeWindStyleSheet } from "../../src";
import { testCompile } from "../test-utils";

afterEach(() => {
  NativeWindStyleSheet.__reset();
  jest.clearAllMocks();
});

testCompile("hover:text-black", (output) => {
  expect(output).toStrictEqual({
    "hover:text-black": {
      conditions: ["hover"],
      meta: {
        hover: true,
      },
      styles: [
        {
          color: "#000",
        },
      ],
    },
  });
});
