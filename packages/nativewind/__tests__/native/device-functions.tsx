import { render } from "@testing-library/react-native";
import { create } from "../test-utils";
import { NativeWindStyleSheet, styled } from "../../src";
import {
  hairlineWidth,
  platformSelect,
  platformColor,
  pixelRatio,
  pixelRatioSelect,
  fontScale,
  fontScaleSelect,
  getPixelSizeForLayoutSize,
  roundToNearestPixel,
} from "../../src/runtime/native/theme-functions";

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
      style: { fontSize: 14 },
    },
    {}
  );
});

test("platformColor", () => {
  create("text-test", {
    config: {
      theme: {
        colors: {
          test: platformColor("red", "blue"),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: {
        color: {
          semantic: ["red", "blue"],
        },
      },
    },
    {}
  );
});

test("pixelRatio()", () => {
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

test("pixelRatio(2)", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: pixelRatio(2),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 4 },
    },
    {}
  );
});

test("pixelRatioSelect", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: pixelRatioSelect({
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
      style: { fontSize: 28 },
    },
    {}
  );
});

test("fontScale()", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: fontScale(),
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

test("fontScale(2)", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: fontScale(2),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 4 },
    },
    {}
  );
});

test("fontScaleSelect", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: fontScaleSelect({
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
      style: { fontSize: 28 },
    },
    {}
  );
});

test("getPixelSizeForLayoutSize", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: getPixelSizeForLayoutSize(4),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 8 },
    },
    {}
  );
});

test("roundToNearestPixel", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: roundToNearestPixel(4.2),
        },
      },
    },
  });

  const MyComponent = jest.fn();
  const StyledComponent = styled(MyComponent);

  render(<StyledComponent className="text-test" />);

  expect(MyComponent).toHaveBeenCalledWith(
    {
      style: { fontSize: 4 },
    },
    {}
  );
});

test("nested", () => {
  create("text-test", {
    config: {
      theme: {
        fontSize: {
          test: platformSelect({
            ios: roundToNearestPixel("var(--empty, 2rem)"),
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
      style: { fontSize: 28 },
    },
    {}
  );
});
