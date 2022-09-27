import { expectError, tailwindRunner } from "./runner";

tailwindRunner("Interactivity - Appearance", expectError(["appearance-none"]));
