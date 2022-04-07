export function preAspectRatio(value: string | number) {
  if (value === "auto") {
    return "0";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (value.includes("/")) {
    const [a, b] = value.split("/");
    const intA = Number.parseInt(a.trim());
    const intB = Number.parseInt(b.trim());
    return `${intA / intB}`;
  }
}

export function postAspectRatio(value?: number) {
  if (!value) {
    return undefined;
  }

  return value;
}
