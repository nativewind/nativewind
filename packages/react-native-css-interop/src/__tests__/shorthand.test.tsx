/** @jsxImportSource test */
import { Text } from "react-native";
import { render, registerCSS, setupAllComponents, screen, testID } from "test";

setupAllComponents();

describe("text-shadow", () => {
  test("<offsetX> <offsetY>", () => {
    registerCSS(
      `.my-class { --my-var: 10px 10px; text-shadow: var(--my-var); }`,
    );

    render(<Text testID={testID} className="my-class" />);

    expect(screen.getByTestId(testID)).toHaveStyle({
      textShadowColor: "black",
      textShadowOffset: {
        height: 10,
        width: 10,
      },
      textShadowRadius: 0,
    });
  });

  test("<color> <offsetX> <offsetY>", () => {
    registerCSS(
      `.my-class { --my-var: 10px 10px; text-shadow: red var(--my-var); }`,
    );

    render(<Text testID={testID} className="my-class" />);

    expect(screen.getByTestId(testID)).toHaveStyle({
      textShadowColor: "red",
      textShadowOffset: {
        height: 10,
        width: 10,
      },
      textShadowRadius: 0,
    });
  });

  test("<offsetX> <offsetY> <color>", () => {
    registerCSS(
      `.my-class { --my-var: 10px 10px; text-shadow: var(--my-var) red; }`,
    );

    render(<Text testID={testID} className="my-class" />);

    expect(screen.getByTestId(testID)).toHaveStyle({
      textShadowColor: "red",
      textShadowOffset: {
        height: 10,
        width: 10,
      },
      textShadowRadius: 0,
    });
  });
});
