import type { IncomingMessage } from "connect";
import { type ServerResponse } from "http";
import {
  CssToReactNativeRuntimeOptions,
  cssToReactNativeRuntime,
} from "../css-to-rn";
import { StyleSheetRegisterCompiledOptions } from "../types";

const connections = new Set<ServerResponse<IncomingMessage>>();
const last = {
  version: 0,
  data: undefined as StyleSheetRegisterCompiledOptions | undefined,
  json: undefined as string | undefined,
};

export const middleware = [
  "/__css_interop_update_endpoint",
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    const version = parseInt(req.url?.split("?version=")[1] ?? "0");

    if (version && version < last.version) {
      res.write(`data: {"version":${last.version},"data":${last.json}}\n\n`);
      res.end();
      return;
    }

    connections.add(res);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    setTimeout(() => {
      res.end();
      connections.delete(res);
    }, 30000);

    req.on("close", () => connections.delete(res));
  },
] as const;

export function sendUpdate(
  data: string | Buffer,
  version: number,
  config?: CssToReactNativeRuntimeOptions,
) {
  const newData = cssToReactNativeRuntime(data, config);

  const newJson = JSON.stringify(newData);

  const dataToSend = last.data ? getDiff(newData, last.data) : newJson;

  last.version = version;
  last.data = newData;
  last.json = newJson;

  for (const connection of connections) {
    connection.write(
      `data: {"version":${last.version},"data":${dataToSend}}\n\n`,
    );
    connection.end();
  }
}

function getDiff(
  current: StyleSheetRegisterCompiledOptions,
  previous: StyleSheetRegisterCompiledOptions,
) {
  return JSON.stringify({
    $$compiled: true,
    flags: current.flags,
    rem: current.rem,
    rootVariables: current.rootVariables,
    universalVariables: current.universalVariables,
    rules: current.rules?.filter((rule, index) => {
      const match = previous.rules?.find((r) => r[0] === rule[0]);
      return match ? !deepEqual(rule, match) : true;
    }),
    keyframes: current.keyframes?.filter((keyframe, index) => {
      const match = previous.keyframes?.find((r) => r[0] === keyframe[0]);
      return match ? !deepEqual(keyframe, match) : true;
    }),
  });
}

function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) {
    // it's just the same object. No need to compare.
    return true;
  }

  //check if value is primitive
  if (obj1 !== Object(obj1) && obj2 !== Object(obj2)) {
    // compare primitives
    return obj1 === obj2;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  // compare objects with same number of keys
  for (let key in obj1) {
    if (!(key in obj2)) return false; //other object doesn't have this prop
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}
