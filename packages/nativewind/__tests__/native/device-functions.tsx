import { render } from "@testing-library/react-native";
import { create } from "../test-utils";
import {
  hairlineWidth,
  NativeWindStyleSheet,
  pixelRatio,
  platformSelect,
  styled,
} from "../../src";

afterEach(() => {
  NativeWindStyleSheet.__reset();
  jest.clearAllMocks();
});

test("hairlineWidth", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: hairlineWidth(),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 0.5 },
    },
    {}
  );
});

test("platformSelect", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: platformSelect({
            ios: "1rem", // These tests run as ios
            default: 2,
          }),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 16 },
    },
    {}
  );
});

test.skip("pixelRatio - get", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: pixelRatio(),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 2 },
    },
    {}
  );
});

test.skip("pixelRatio - specifics", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: pixelRatio({
            1: "1rem",
            2: "2rem",
            3: "3rem",
          }),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 32 },
    },
    {}
  );
});

test.skip("nested", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          // These tests run as ios with
          // a pixelRatio of 2
          test: platformSelect({
            ios: pixelRatio({
              1: "1rem",
              2: `var(--empty-var, ${hairlineWidth()})`,
            }),
            default: 2,
          }),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 32 },
    },
    {}
  );
});
