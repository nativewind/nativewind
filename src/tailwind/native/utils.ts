// eslint-disable-next-line @typescript-eslint/ban-types
export function isPlainObject(value: unknown): value is Object {
  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
