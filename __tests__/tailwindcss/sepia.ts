import { expectError, tailwindRunner } from "./runner";

tailwindRunner("Filters - Sepia", expectError(["sepia-0", "sepia"]));
