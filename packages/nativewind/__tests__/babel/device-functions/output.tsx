import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <View>
      <_StyledComponent className="border-hairline" component={Text}>
        Hello world!
      </_StyledComponent>
    </View>
  );
}
_NativeWindStyleSheet.create({
  styles: {
    "border-hairline": {
      borderTopWidth: _NativeWindStyleSheet.hairlineWidth(),
      borderRightWidth: _NativeWindStyleSheet.hairlineWidth(),
      borderBottomWidth: _NativeWindStyleSheet.hairlineWidth(),
      borderLeftWidth: _NativeWindStyleSheet.hairlineWidth(),
    },
  },
});
