/** @jsxImportSource nativewind */
import { ViewProps } from "react-native";

import { Metrics, SafeAreaProvider } from "react-native-safe-area-context";

import { INTERNAL_SET, native, renderCurrentTest } from "../test";

const { vh } = native;

const initialMetrics: Metrics = {
  insets: {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  frame: {
    x: 0,
    y: 0,
    height: 100,
    width: 100,
  },
};

const cssOptions = {
  inlineRem: 14,
};

function Wrapper({ children }: ViewProps) {
  return (
    <SafeAreaProvider initialMetrics={initialMetrics}>
      {children}
    </SafeAreaProvider>
  );
}

test("works without the wrapper", async () => {
  expect(await renderCurrentTest({ cssOptions })).toStrictEqual({
    props: {},
  });
});

test("m-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
      },
    },
  });
});

test("mx-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        marginLeft: 10,
        marginRight: 10,
      },
    },
  });
});
test("my-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        marginBottom: 10,
        marginTop: 10,
      },
    },
  });
});
test("ms-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        marginStart: 10,
      },
    },
  });
});
test("me-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        marginEnd: 10,
      },
    },
  });
});
test("mt-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        marginTop: 10,
      },
    },
  });
});
test("mr-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        marginRight: 10,
      },
    },
  });
});
test("mb-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        marginBottom: 10,
      },
    },
  });
});

test("ml-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        marginLeft: 10,
      },
    },
  });
});

test("p-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
      },
    },
  });
});

test("px-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        paddingLeft: 10,
        paddingRight: 10,
      },
    },
  });
});
test("py-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        paddingBottom: 10,
        paddingTop: 10,
      },
    },
  });
});
test("ps-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        paddingStart: 10,
      },
    },
  });
});
test("pe-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        paddingEnd: 10,
      },
    },
  });
});
test("pt-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        paddingTop: 10,
      },
    },
  });
});
test("pr-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        paddingRight: 10,
      },
    },
  });
});
test("pb-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        paddingBottom: 10,
      },
    },
  });
});
test("pl-safe", async () => {
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        paddingLeft: 10,
      },
    },
  });
});

test("min-h-screen-safe", async () => {
  vh[INTERNAL_SET](100);

  // calc(100vh - (env(safe-area-inset-top) + env(safe-area-inset-bottom)));
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        minHeight: 80,
      },
    },
  });
});

test("max-h-screen-safe", async () => {
  vh[INTERNAL_SET](100);

  // calc(100vh - (env(safe-area-inset-top) + env(safe-area-inset-bottom)));
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        maxHeight: 80,
      },
    },
  });
});

test("h-screen-safe", async () => {
  vh[INTERNAL_SET](100);

  // calc(100vh - (env(safe-area-inset-top) + env(safe-area-inset-bottom)));
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        height: 80,
      },
    },
  });
});

test("inset-safe", async () =>
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        bottom: 10,
        left: 10,
        right: 10,
        top: 10,
      },
    },
  }));
test("inset-x-safe", async () =>
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        left: 10,
        right: 10,
      },
    },
  }));
test("inset-y-safe", async () =>
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        bottom: 10,
        top: 10,
      },
    },
  }));
test("start-safe", async () =>
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        insetInlineStart: 10,
      },
    },
  }));
test("end-safe", async () =>
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        insetInlineEnd: 10,
      },
    },
  }));
test("top-safe", async () =>
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        top: 10,
      },
    },
  }));
test("right-safe", async () =>
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        right: 10,
      },
    },
  }));
test("bottom-safe", async () =>
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        bottom: 10,
      },
    },
  }));
test("left-safe", async () =>
  expect(
    await renderCurrentTest({ wrapper: Wrapper, cssOptions }),
  ).toStrictEqual({
    props: {
      style: {
        left: 10,
      },
    },
  }));

test("pb-safe-offset-4", async () => {
  // calc(env(safe-area-inset-right) + 2rem);
  expect(
    await renderCurrentTest({
      wrapper: Wrapper,
      cssOptions,
    }),
  ).toStrictEqual({
    props: {
      style: {
        paddingBottom: 24, // 10 + 14
      },
    },
  });
});

test("pb-safe-or-20", async () => {
  // max(env(safe-area-inset-right), 5rem);
  expect(
    await renderCurrentTest({
      wrapper: Wrapper,
      cssOptions,
    }),
  ).toStrictEqual({
    props: {
      style: {
        paddingBottom: cssOptions.inlineRem * 5,
      },
    },
  });
});
