/**
 * ISC License (ISC)
 *
 * Copyright (c) 2018 - 2020 React Native Community
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

/*
 * Source: https://github.com/react-native-community/hooks/blob/34548fb56e30cb115e9dfbf516663eaa862a50ea/src/useDeviceOrientation.ts
 */
import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

const isOrientationPortrait = ({ width, height }: ScaledSize) =>
  height >= width;
const isOrientationLandscape = ({ width, height }: ScaledSize) =>
  width >= height;

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState(() => {
    const screen = Dimensions.get("screen");
    return {
      portrait: isOrientationPortrait(screen),
      landscape: isOrientationLandscape(screen),
    };
  });

  useEffect(() => {
    const onChange = ({ screen }: { screen: ScaledSize }) => {
      setOrientation({
        portrait: isOrientationPortrait(screen),
        landscape: isOrientationLandscape(screen),
      });
    };

    const subscription = Dimensions.addEventListener("change", onChange);

    return () => {
      if (typeof subscription?.remove === "function") {
        subscription.remove();
      } else {
        // React Native < 0.65
        Dimensions.removeEventListener("change", onChange);
      }
    };
  }, []);

  return orientation;
}
