import { tailwindRunner, expectError } from "./runner";

tailwindRunner("Layout - Visibility", expectError(["visible", "invisible"]));
