import { renderCurrentTest } from "../test";

describe("Effects - Box Shadow", () => {
  test("shadow-sm", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          shadowColor: "#00000059",
          shadowOpacity: 1,
          shadowOffset: {
            height: 1,
            width: 0,
          },
          shadowRadius: 1,
        },
      },
    });
  });
  test("shadow", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          shadowColor: "#00000059",
          shadowOpacity: 1,
          shadowOffset: {
            height: 1,
            width: 0,
          },
          shadowRadius: 4,
        },
      },
    });
  });
  test("shadow-none", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
        style: {
          shadowColor: "#00000000",
          shadowOpacity: 1,
          shadowOffset: {
            height: 0,
            width: 0,
          },
          shadowRadius: 0,
        },
      },
    });
  });
});

describe.skip("Effects - Box Shadow Color", () => {
  // TODO
});

describe("Effects - Opacity", () => {
  test("opacity-0", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { opacity: 0 } },
    }));
  test("opacity-100", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: { style: { opacity: 1 } },
    }));
});

describe("Effects - Mix Blend Mode", () => {
  const options = {
    cssOptions: {
      features: {
        mixBlendModeEnabled: true,
      },
    },
  };

  test("mix-blend-normal", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "normal",
        },
      },
    });
  });

  test("mix-blend-multiply", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "multiply",
        },
      },
    });
  });

  test("mix-blend-screen", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "screen",
        },
      },
    });
  });

  test("mix-blend-overlay", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "overlay",
        },
      },
    });
  });

  test("mix-blend-darken", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "darken",
        },
      },
    });
  });

  test("mix-blend-lighten", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "lighten",
        },
      },
    });
  });

  test("mix-blend-color-dodge", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "color-dodge",
        },
      },
    });
  });

  test("mix-blend-color-burn", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "color-burn",
        },
      },
    });
  });

  test("mix-blend-hard-light", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "hard-light",
        },
      },
    });
  });

  test("mix-blend-soft-light", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "soft-light",
        },
      },
    });
  });

  test("mix-blend-difference", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "difference",
        },
      },
    });
  });

  test("mix-blend-exclusion", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "exclusion",
        },
      },
    });
  });

  test("mix-blend-hue", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "hue",
        },
      },
    });
  });

  test("mix-blend-saturation", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "saturation",
        },
      },
    });
  });

  test("mix-blend-color", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "color",
        },
      },
    });
  });

  test("mix-blend-luminosity", async () => {
    expect(await renderCurrentTest(options)).toStrictEqual({
      props: {
        style: {
          mixBlendMode: "luminosity",
        },
      },
    });
  });
});

describe("Effects - Background Blend Mode", () => {
  test("bg-blend-normal", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-multiply", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-screen", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-overlay", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-darken", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-lighten", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-color-dodge", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-color-burn", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-hard-light", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-soft-light", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-difference", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-exclusion", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-hue", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-saturation", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-color", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
  test("bg-blend-luminosity", async () =>
    expect(await renderCurrentTest()).toStrictEqual({
      props: {},
      invalid: { properties: ["background-blend-mode"] },
    }));
});
