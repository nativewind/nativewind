import { measurePerformance } from "reassure";

// Native
import { Text as RNText, StyleSheet } from "react-native";

// NativeWind
import { styled as NWStyled, NativeWindStyleSheet } from "nativewind";

// Tailwind React Native Classnames
import tw from "twrnc";

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

describe("Text - Basic Styles:", () => {
  test("StyleSheet", async () => {
    const styles = StyleSheet.create({
      test: {
        color: "#000",
        fontSize: 14,
        fontWeight: "bold",
      },
    });

    await measurePerformance(
      <>
        {range.map((key) => (
          <RNText key={key} style={styles.test}>
            {key}
          </RNText>
        ))}
      </>,
      measureOptions
    );
  });

  test("NativeWind", async () => {
    NativeWindStyleSheet.create({
      styles: {
        "text-black": {
          color: "#000",
        },
        "text-sm": {
          fontSize: 14,
        },
        "font-bold": {
          fontWeight: "bold",
        },
      },
    });

    const NWText = NWStyled(
      RNText,
      `text-black
      text-sm
      font-bold`
    );

    await measurePerformance(
      <>
        {range.map((key) => (
          <NWText key={key}>{key}</NWText>
        ))}
      </>,
      measureOptions
    );
  });

  test("Tailwind React Native Classnames", async () => {
    await measurePerformance(
      <>
        {range.map((key) => (
          <RNText key={key} style={tw`text-black text-sm font-bold`}>
            {key}
          </RNText>
        ))}
      </>,
      measureOptions
    );
  });

  test("React Native Paper", async () => {
    await measurePerformance(
      <>
        {range.map((key) => (
          <RNPaperText key={key} variant="bodyLarge">
            {key}
          </RNPaperText>
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
          <UIKittenText key={key} category="s1">
            {key}
          </UIKittenText>
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
          <DText
            key={key}
            sx={{
              color: "#000",
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            {key}
          </DText>
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
          <NativeBaseText key={key} fontSize="sm" bold color="#000">
            {key}
          </NativeBaseText>
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
});
