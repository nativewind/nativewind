import { StyledComponent as _StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <_StyledComponent className="container" component={View}>
      <_StyledComponent tw="font-bold" component={Text}>
        Hello world!
      </_StyledComponent>
    </_StyledComponent>
  );
}
