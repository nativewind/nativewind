import { View } from "react-native";
import { measurePerformance } from "reassure";

test("Simple test", async () => {
  await measurePerformance(<View />);
});
