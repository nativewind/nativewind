import { getCreateOptions } from "../../src/transform-css";

test("merges duplicate classes", () => {
  const options = getCreateOptions(`
    :root {
      --dark-mode: class
    }

    :root {
      --test: yellow
    }
  `);

  expect(options).toStrictEqual({
    ":root": {
      variables: [
        {
          "--dark-mode": "class",
          "--test": "yellow",
        },
      ],
    },
  });
});
