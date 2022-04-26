import { spawn } from "node:child_process";

describe("cli", () => {
  it("should exit with code 0", (done) => {
    spawn("node", ["cli", "--help"]).on("close", (code) => {
      expect(code).toBe(0);
      done();
    });
  });
});
