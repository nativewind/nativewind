import { measurePerformance } from "reassure";

import { Text as RNText } from "../components/react-native";
import { Text as NWText } from "../components/nativewind";
import { Text as NBText, NativeBaseProvider } from "../components/native-base";

jest.setTimeout(60_000);

const range = [...Array.from({ length: 100 }).keys()];

test("Text - NativeBase", async () => {
  await measurePerformance(
    <>
      {range.map((key) => (
        <NBText key={key}>{key}</NBText>
      ))}
    </>,
    {
      wrapper(node) {
        return <NativeBaseProvider>{node}</NativeBaseProvider>;
      },
    }
  );
});

test("Text - Native", async () => {
  await measurePerformance(
    <>
      {range.map((key) => (
        <RNText key={key}>{key}</RNText>
      ))}
    </>
  );
});

test("Text - Native2", async () => {
  await measurePerformance(
    <>
      {range.map((key) => (
        <RNText key={key}>{key}</RNText>
      ))}
    </>
  );
});

test("Text - NativeWind", async () => {
  await measurePerformance(
    <>
      {range.map((key) => (
        <NWText key={key}>{key}</NWText>
      ))}
    </>
  );
});
