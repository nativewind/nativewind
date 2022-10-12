import { testCompile } from "../utilities";

testCompile("container", (output) => {
  expect(output).toStrictEqual({
    container: {
      styles: [
        { width: "100%" },
        { maxWidth: 640 },
        { maxWidth: 768 },
        { maxWidth: 1024 },
        { maxWidth: 1280 },
        { maxWidth: 1536 },
      ],
      atRules: {
        1: [["min-width", 640]],
        2: [["min-width", 768]],
        3: [["min-width", 1024]],
        4: [["min-width", 1280]],
        5: [["min-width", 1536]],
      },
      topics: ["device-width"],
    },
  });
});

testCompile("hover:text-red-500", (output) => {
  expect(output).toStrictEqual({
    "hover:text-red-500": {
      styles: [{ color: "#ef4444" }],
      conditions: ["hover"],
    },
  });
});

testCompile("dark:group-hover:hover:text-red-500", (output) => {
  expect(output).toStrictEqual({
    "dark:group-hover:hover:text-red-500": {
      styles: [{ color: "#ef4444" }],
      conditions: ["hover", "group-hover"],
      topics: ["--color-scheme"],
      atRules: {
        "0": [["--color-scheme", "dark"]],
      },
    },
  });
});
//   "scale-50": {
//     styles: [{ transform: [{ scaleY: 0.5 }, { scaleX: 0.5 }] }],
//   },
//   "group-hover:text-red-500": {
//     styles: [{ color: "#ef4444" }],
//     conditions: ["group-hover"],
//   },
//   "lg:hover:divide-x-2": {
//     "lg:hover:divide-x-2": {
//       styles: [{}],
//       conditions: ["hover", "parent"],
//       childClasses: ["lg:hover:divide-x-2.children"],
//       topics: ["width"],
//       atRules: {
//         0: [["media", "(min-width: 1024px)"]],
//       },
//     },
//     "lg:hover:divide-x-2.children": {
//       styles: [{ borderLeftWidth: 2, borderRightWidth: 0 }],
//       conditions: ["not-first-child"],
//       topics: ["width"],
//       atRules: {
//         0: [["media", "(min-width: 1024px)"]],
//       },
//     },
//   },
// };

// testEachCase(cases);
