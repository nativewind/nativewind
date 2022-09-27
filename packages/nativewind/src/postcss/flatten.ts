export function flatten<T extends Record<string, unknown>>(
  objectArray: T[]
): T {
  let returnObject = {} as T;
  for (const object of objectArray) {
    for (const [key, value] of Object.entries(object)) {
      returnObject = setValue(returnObject, key, value);
    }
  }

  return returnObject;
}

function setValue<T extends Record<string, unknown>>(
  object: T,
  is: string | string[],
  value: unknown
): T {
  if (typeof is == "string") {
    return setValue<T>(object, is.split("."), value);
  } else if (is.length == 1) {
    (object as Record<string, unknown>)[is[0]] = value;
    return object;
  } else {
    (object as Record<string, unknown>)[is[0]] = setValue<T>(
      (object[is[0]] || {}) as T,
      is.slice(1),
      value
    );
    return object;
  }
}
