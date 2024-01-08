import { FlatList, View } from "react-native";
import { render, screen } from "@testing-library/react-native";

import {
  registerCSS,
  resetComponents,
  resetStyles,
  createRemappedComponent,
  revealStyles,
} from "../testing-library";
import { styleSignals } from "../runtime/native/globals";
import { RefObject, useRef } from "react";
import { remapProps } from "../runtime/components/api";

const testID = "react-native-css-interop";

beforeEach(() => {
  resetStyles();
  resetComponents();
});

test("mapping", () => {
  //@ts-expect-error
  const A = createRemappedComponent(View, { className: "differentStyle" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<A testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    differentStyle: [{}, {}],
  });

  expect(revealStyles(component.props)).toEqual({
    testID,
    differentStyle: [
      styleSignals.get("bg-black")?.get(),
      styleSignals.get("text-white")?.get(),
    ],
  });
});

test("works with ref", () => {
  remapProps(FlatList, {});
  let listRef: RefObject<FlatList<any>> = { current: null };
  const items = Array.from(Array(100).keys());

  const Component = () => {
    listRef = useRef<FlatList>(null);
    return (
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(_, i) => i.toString()}
        renderItem={(_) => <View />}
      />
    );
  };

  render(<Component />);

  expect(listRef.current).toBeInstanceOf(FlatList);
});
