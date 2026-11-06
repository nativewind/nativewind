/**
 * @jest-environment jsdom
 */
import type { colorScheme as ColorScheme } from "../runtime/web/api";

const realGetComputedStyle = window.getComputedStyle;

beforeEach(() => {
  // jsdom returns a snapshot, but browsers return a live declaration, which
  // is how the runtime sees a stylesheet that is inserted after it loads
  jest.spyOn(window, "getComputedStyle").mockImplementation(
    (element) =>
      new Proxy({} as CSSStyleDeclaration, {
        get(_, property) {
          const declaration = realGetComputedStyle.call(window, element);
          const value = Reflect.get(declaration, property);
          return typeof value === "function" ? value.bind(declaration) : value;
        },
      }),
  );
});

afterEach(() => {
  document.head.replaceChildren();
  document.documentElement.className = "";
  jest.restoreAllMocks();
});

function loadRuntimeBeforeStylesheet(systemColorScheme: "light" | "dark") {
  let colorScheme!: typeof ColorScheme;
  jest.isolateModules(() => {
    jest
      .spyOn(require("react-native").Appearance, "getColorScheme")
      .mockReturnValue(systemColorScheme);
    colorScheme = require("../runtime/web/api").colorScheme;
  });
  return colorScheme;
}

async function insertStylesheet(darkMode: string) {
  const style = document.createElement("style");
  style.textContent = `:root { --css-interop-darkMode: ${darkMode}; }`;
  document.head.appendChild(style);
  await Promise.resolve();
}

test("a stylesheet with darkMode media inserted after the runtime loads does not throw", async () => {
  const uncaughtErrors: unknown[] = [];
  const recordError = (event: ErrorEvent) => uncaughtErrors.push(event.error);
  const colorScheme = loadRuntimeBeforeStylesheet("dark");

  window.addEventListener("error", recordError);
  try {
    await insertStylesheet("media");
  } finally {
    window.removeEventListener("error", recordError);
  }

  expect(uncaughtErrors).toEqual([]);
  expect(colorScheme.get()).toBe("dark");
  expect(() => colorScheme.set("light")).toThrow(
    "Cannot manually set color scheme, as dark mode is type 'media'",
  );
});

test("a stylesheet with darkMode class inserted after the runtime loads reads the dark class", async () => {
  document.documentElement.classList.add("dark");
  const colorScheme = loadRuntimeBeforeStylesheet("light");

  await insertStylesheet("class dark");

  expect(colorScheme.get()).toBe("dark");
});

test("a stylesheet with darkMode class inserted after the runtime loads follows the system without the dark class", async () => {
  const colorScheme = loadRuntimeBeforeStylesheet("dark");

  await insertStylesheet("class dark");

  expect(colorScheme.get()).toBe("dark");
  expect(document.documentElement.classList.contains("dark")).toBe(false);
  colorScheme.set("dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

test("a stylesheet with darkMode attribute inserted after the runtime loads leaves the color scheme alone", async () => {
  const colorScheme = loadRuntimeBeforeStylesheet("dark");
  colorScheme.set("light");

  await insertStylesheet("attribute data-dark");

  expect(colorScheme.get()).toBe("light");
});
