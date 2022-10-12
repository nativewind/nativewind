import { testCompile } from "../utilities";

testCompile(
  "",
  { name: "number", css: `:root { --number: 255; }` },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [
          {
            "--number": 255,
          },
        ],
      },
    });
  }
);

testCompile(
  "",
  {
    name: "number default value",
    css: `:root { --default-value: var(--red, 2); }`,
  },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [
          {
            "--default-value": {
              function: "var",
              values: ["--red", 2],
            },
          },
        ],
      },
    });
  }
);

testCompile(
  "",
  { name: "string", css: `:root { --string: string; }` },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [
          {
            "--string": "string",
          },
        ],
      },
    });
  }
);

testCompile(
  "",
  {
    name: "string default value",
    css: `:root { --default-value: var(--red, blue); }`,
  },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [
          {
            "--default-value": {
              function: "var",
              values: ["--red", "blue"],
            },
          },
        ],
      },
    });
  }
);

testCompile("", { name: "unit", css: `:root { --unit: 123vw; }` }, (output) => {
  expect(output).toStrictEqual({
    ":root": {
      variables: [
        {
          "--unit": {
            function: "vw",
            values: [123],
          },
        },
      ],
    },
  });
});

testCompile(
  "",
  { name: "static function", css: `:root { --rgb: rgb(255, 255, 255); }` },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [
          {
            "--rgb": "rgb(255, 255, 255)",
          },
        ],
      },
    });
  }
);

testCompile(
  "",
  {
    name: "dynamic function",
    css: `:root { --rbg: rgb(255, 255, var(--blue)); }`,
  },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [
          {
            "--rbg": {
              function: "inbuilt",
              values: [
                "rgb",
                255,
                255,
                {
                  function: "var",
                  values: ["--blue"],
                },
              ],
            },
          },
        ],
      },
    });
  }
);

testCompile(
  "",
  {
    name: "rem",
    css: `:root { font-size: 16px; }`,
  },
  (output) => {
    expect(output).toStrictEqual({
      ":root": {
        variables: [
          {
            "--rem": 16,
          },
        ],
      },
    });
  }
);
