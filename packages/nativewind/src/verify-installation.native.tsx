import {
  verifyJSX,
  verifyHasStyles,
  verifyAtRule,
} from "react-native-css-interop/doctor";

export function verifyInstallation() {
  if (!verifyJSX()) {
    throw new Error(
      "jsxImportSource was not set to 'nativewind'. Please refer to http://nativewind.dev/troubleshooting#jsxImportSource",
    );
  }

  if (!verifyAtRule("nativewind-metro")) {
    throw new Error(
      "Nativewind was unable to detect it's metro configuration. Please refer to http://nativewind.dev/troubleshooting#missing-metro",
    );
  }

  if (!verifyRecievedData()) {
    throw new Error(
      "Nativewind received no data. Please refer to http://nativewind.dev/troubleshooting#no-data",
    );
  }

  if (!verifyHasStyles()) {
    throw new Error(
      "Nativewind received no data. Please refer to http://nativewind.dev/troubleshooting#no-data",
    );
  }

  if (!verifyAtRule("nativewind-preset")) {
    throw new Error(
      "Nativewind: was unable to detect the 'nativewind/preset'. Please refer to http://nativewind.dev/troubleshooting#tailwind-preset",
    );
  }
}
