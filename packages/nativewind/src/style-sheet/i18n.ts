import context from "./context";

export function setDirection(direction: "ltr" | "rtl") {
  context.setTopics({
    "--i18n-direction": direction,
  });
}
