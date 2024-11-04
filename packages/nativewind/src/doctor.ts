import { verifyData, verifyFlag, verifyJSX } from "react-native-css-interop";

export function verifyInstallation() {
  if (process.env.NODE_ENV !== "development") {
    console.warn(
      "verifyInstallation() was called in a non-development environment()",
    );
  }

  if (!verifyJSX()) {
    throw new Error(
      "jsxImportSource was not set to 'nativewind'. Please refer to http://nativewind.dev/troubleshooting#jsxImportSource",
    );
  }
  if (!verifyData()) {
    throw new Error(
      "Nativewind received no data. Please refer to http://nativewind.dev/troubleshooting#no-data",
    );
  }
  if (!verifyFlag("nativewind")) {
    throw new Error(
      "Nativewind: was unable to detect the 'nativewind/preset'. Please refer to http://nativewind.dev/troubleshooting#tailwind-preset",
    );
  }

  console.log("NativeWind verifyInstallation() found no errors");
  return true;
}
