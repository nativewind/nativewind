import { expectError, createTests, tailwindRunner, spacing } from "./runner";

const tests = [
  // createTests("m", spacing, (n) => ({
  //   marginBottom: n,
  //   marginLeft: n,
  //   marginRight: n,
  //   marginTop: n,
  // })),

  // createTests("mx", spacing, (n) => ({
  //   marginLeft: n,
  //   marginRight: n,
  // })),

  // createTests("my", spacing, (n) => ({
  //   marginTop: n,
  //   marginBottom: n,
  // })),

  // createTests("mt", spacing, (n) => ({
  //   marginTop: n,
  // })),

  // createTests("mr", spacing, (n) => ({
  //   marginRight: n,
  // })),

  // createTests("mb", spacing, (n) => ({
  //   marginBottom: n,
  // })),

  createTests("ml", spacing, (n) => ({
    marginLeft: n,
  })),

  expectError([
    "m-auto",
    "mx-auto",
    "my-auto",
    "mt-auto",
    "mr-auto",
    "mb-auto",
    "ml-auto",
  ]),
].flat();

tailwindRunner("Layout - Margin", tests);
