import { expectError, tailwindRunner } from "./runner";

tailwindRunner("Typography - Content", expectError(["content-none"]));
