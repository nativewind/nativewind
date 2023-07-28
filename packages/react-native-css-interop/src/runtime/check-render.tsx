export function checkJsxPragma() {
  const Component = Object.assign(() => {}, {
    "react-native-css-interop-jsx-pragma-check": true,
  });

  // @ts-expect-error We verify setup by returning a non-standard value
  return <Component /> !== true;
}
