declare module "@babel/helper-module-imports" {
  export function addNamed(path: unknown, name: string, source: string);
  export function addSideEffect(path: unknown, source: string);
}
