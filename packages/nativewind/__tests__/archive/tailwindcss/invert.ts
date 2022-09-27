import { expectError, tailwindRunner } from "./runner";

tailwindRunner("Filters - Invert", expectError(["invert-0", "invert"]));
