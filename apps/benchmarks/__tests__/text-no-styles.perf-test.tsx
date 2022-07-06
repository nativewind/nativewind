import { measurePerformance } from "reassure";

// Native
import { Text as RNText } from "react-native";

// NativeWind
import { styled as NWStyled } from "nativewind";

// NativeBase
import { Text as NativeBaseText, NativeBaseProvider } from "native-base";

// React Native Paper
import {
  Provider as PaperProvider,
  Text as RNPaperText,
} from "react-native-paper";

// UI Kitten
import {
  ApplicationProvider as UIKittenProvider,
  Text as UIKittenText,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";

// Dripsy
import {
  DripsyProvider,
  makeTheme as makeDripsyTheme,
  Text as DText,
} from "dripsy";

jest.setTimeout(60_000);

const range = [...Array.from({ length: 100 }).keys()];
const measureOptions: Parameters<typeof measurePerformance>[1] = {
  runs: 50,
};

describe("Text - No Styles:", () => {
  test("Native", async () => {
    await measurePerformance(
      <>
        {range.map((key) => (
          <RNText key={key}>{key}</RNText>
        ))}
      </>,
      measureOptions
    );
  });

  test("React Native Paper", async () => {
    await measurePerformance(
      <>
        {range.map((key) => (
          <RNPaperText key={key}>{key}</RNPaperText>
        ))}
      </>,
      {
        ...measureOptions,
        wrapper(node) {
          return <PaperProvider>{node}</PaperProvider>;
        },
      }
    );
  });

  test("UI Kitten", async () => {
    await measurePerformance(
      <>
        {range.map((key) => (
          <UIKittenText key={key}>{key}</UIKittenText>
        ))}
      </>,
      {
        ...measureOptions,
        wrapper(node) {
          return (
            <UIKittenProvider {...eva} theme={eva.light}>
              {node}
            </UIKittenProvider>
          );
        },
      }
    );
  });

  test("Dripsy", async () => {
    const theme = makeDripsyTheme({});
    await measurePerformance(
      <>
        {range.map((key) => (
          <DText key={key}>{key}</DText>
        ))}
      </>,
      {
        ...measureOptions,
        wrapper(node) {
          return <DripsyProvider theme={theme}>{node}</DripsyProvider>;
        },
      }
    );
  });

  test("NativeBase", async () => {
    await measurePerformance(
      <>
        {range.map((key) => (
          <NativeBaseText key={key}>{key}</NativeBaseText>
        ))}
      </>,
      {
        ...measureOptions,
        wrapper(node) {
          return (
            <NativeBaseProvider
              initialWindowMetrics={{
                frame: { x: 0, y: 0, width: 0, height: 0 },
                insets: { top: 0, left: 0, right: 0, bottom: 0 },
              }}
            >
              {node}
            </NativeBaseProvider>
          );
        },
      }
    );
  });

  test("NativeWind", async () => {
    const NWText = NWStyled(RNText);
    await measurePerformance(
      <>
        {range.map((key) => (
          <NWText key={key}>{key}</NWText>
        ))}
      </>,
      measureOptions
    );
  });
});
