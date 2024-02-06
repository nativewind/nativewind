import type { IncomingMessage } from "connect";
import type { ServerResponse } from "http";
import {
  CssToReactNativeRuntimeOptions,
  cssToReactNativeRuntime,
} from "../css-to-rn";

const connections = new Set<ServerResponse<IncomingMessage>>();
let lastData: string = "";

export const middleware = [
  "/__css_interop_update_endpoint",
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
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
  config?: CssToReactNativeRuntimeOptions,
) {
  lastData = JSON.stringify(cssToReactNativeRuntime(data, config));

  for (const connection of connections) {
    connection.write(`data: ${lastData}\n\n`);
    connection.end();
  }
}
