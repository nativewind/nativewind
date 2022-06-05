import { Dimensions } from "react-native";

export default function vw(value: number) {
  return new Proxy(
    {},
    {
      get() {
        return Dimensions.get("window").width * (value / 100);
      },
    }
  );
}
