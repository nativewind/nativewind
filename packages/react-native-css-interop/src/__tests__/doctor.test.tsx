import { verifyReceivedData } from "../doctor";
import { verifyHasStyles } from "../doctor.native";
import { registerCSS, resetStyles } from "../testing-library";

beforeEach(() => resetStyles());

test("verifyReceivedData", () => {
  registerCSS(`.my-class { 
    color: hsl(0, 84.2%, 60.2%); 
  }`);

  expect(verifyReceivedData()).toBe(true);
  expect(verifyHasStyles()).toBe(true);
});
