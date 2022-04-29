import { tailwindRunner, expectError } from "./runner";

tailwindRunner("Layout - Object Position", [
  ...expectError(["fixed", "sticky"]),
  // static is a special scenario see to-react-native/properties/position.ts
  ["static", { styles: {} }],
  ["absolute", { styles: { absolute: { position: "absolute" } } }],
  ["relative", { styles: { relative: { position: "relative" } } }],
]);
