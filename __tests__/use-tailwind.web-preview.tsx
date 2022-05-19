import { PropsWithChildren } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useTailwind } from "../src/use-tailwind.web";
import { TailwindProvider, TailwindProviderProps } from "../src/provider";
import { RWNCssStyle } from "../src/use-tailwind";

const wrapper = ({
  children,
  ...props
}: PropsWithChildren<TailwindProviderProps>) => (
  <TailwindProvider {...props}>{children}</TailwindProvider>
);

describe("web", () => {
  test("can accept no arguments", () => {
    const { result } = renderHook(() => useTailwind<RWNCssStyle>()(), {
      wrapper,
      initialProps: { platform: "web", preview: true },
    });

    expect(result.current).toEqual({ $$css: true, tailwindClassName: "" });
  });

  test("will pass-through any arguments", () => {
    const { result } = renderHook(
      () => useTailwind<RWNCssStyle>()("hello-world"),
      {
        wrapper,
        initialProps: { platform: "web", preview: true },
      }
    );

    expect(result.current).toEqual({
      $$css: true,
      tailwindClassName: "hello-world",
    });
  });
});
