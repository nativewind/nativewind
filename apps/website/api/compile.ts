import postcss from "postcss";
import tailwind from "tailwindcss";
import tailwindcssContainerQueries from "@tailwindcss/container-queries";
import { preset } from "nativewind/preset";
import { cssToReactNativeRuntime } from "react-native-css-interop/css-to-rn";

import "lightningcss-linux-x64-gnu/lightningcss.linux-x64-gnu.node";

const handler: VercelApiHandler = async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).end();
    return;
  }

  if (!request.body || typeof request.body.content !== "string") {
    response.status(400).end();
    return;
  }

  let { css: output } = await postcss([
    tailwind({
      theme: {},
      presets: [preset as any],
      plugins: [tailwindcssContainerQueries],
      content: [{ raw: request.body.content, extension: "html" }],
    }),
  ]).process("@tailwind base;@tailwind components;@tailwind utilities;", {
    from: undefined,
  });

  const result = cssToReactNativeRuntime(output, {
    ignorePropertyWarningRegex: ["^--tw-"],
    grouping: ["^group$", "^group/"],
  });

  response.status(200).json(result);
};

function allowCors(fn: VercelApiHandler): VercelApiHandler {
  return async (req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    );
    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }
    return fn(req, res);
  };
}

export default allowCors(handler);

// Vercel's types conflict with React Native's, so we just copied them inline
import type { ServerResponse, IncomingMessage } from "http";
import type { Headers } from "node-fetch";
export type VercelRequestCookies = {
  [key: string]: string;
};
export type VercelRequestQuery = {
  [key: string]: string | string[];
};
export type VercelRequestBody = any;
export type VercelRequest = IncomingMessage & {
  query: VercelRequestQuery;
  cookies: VercelRequestCookies;
  body: VercelRequestBody;
};
export type VercelResponse = ServerResponse & {
  send: (body: any) => VercelResponse;
  json: (jsonBody: any) => VercelResponse;
  status: (statusCode: number) => VercelResponse;
  redirect: (statusOrUrl: string | number, url?: string) => VercelResponse;
};
export type VercelApiHandler = (
  req: VercelRequest,
  res: VercelResponse,
) => void | Promise<void>;
/** @deprecated Use VercelRequestCookies instead. */
export type NowRequestCookies = VercelRequestCookies;
/** @deprecated Use VercelRequestQuery instead. */
export type NowRequestQuery = VercelRequestQuery;
/** @deprecated Use VercelRequestBody instead. */
export type NowRequestBody = any;
/** @deprecated Use VercelRequest instead. */
export type NowRequest = VercelRequest;
/** @deprecated Use VercelResponse instead. */
export type NowResponse = VercelResponse;
/** @deprecated Use VercelApiHandler instead. */
export type NowApiHandler = VercelApiHandler;
export interface VercelProxyResponse {
  status: number;
  headers: Headers;
  body: Buffer | NodeJS.ReadableStream;
  encoding: BufferEncoding;
}
