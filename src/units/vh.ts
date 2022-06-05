import { Dimensions } from "react-native";

export default function vh(value: number) {
  return new Proxy(
    {},
    {
      get() {
        return Dimensions.get("window").height * (value / 100);
      },
    }
  );
}
