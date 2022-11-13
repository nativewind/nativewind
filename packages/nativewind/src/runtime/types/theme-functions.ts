/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PlatformOSType } from "react-native";

export type HairlineWidth = () => any;
export type PlatformSelect = (
  specifics: Partial<Record<PlatformOSType | "default", string | number>>
) => any;
export type PlatformColor = (...colors: string[]) => any;
export type PixelRatio = (value?: number | string) => any;
export type PixelRatioSelect = (values: Record<string, number | string>) => any;
export type FontScale = (value?: number | string) => any;
export type FontScaleSelect = (values: Record<string, number | string>) => any;
export type GetPixelSizeForLayoutSize = (value: number | string) => any;
export type RoundToNearestPixel = (value: number | string) => any;
