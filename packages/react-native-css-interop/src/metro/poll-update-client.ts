import { StyleSheet } from "../runtime";
const url = require("react-native/Libraries/Core/Devtools/getDevServer")().url;

async function pollServer() {
  try {
    const response = await fetch(`${url}__css_interop_update_endpoint`);
    if (!response.ok) {
      console.error(
        "There was a problem connecting to the react-native-css-interop Metro server",
      );
    }

    const body = await response.text();

    if (body.startsWith("data: ")) {
      StyleSheet.registerCompiled({
        $$compiled: true,
        ...JSON.parse(body.slice(6)),
      });
    }

    return pollServer();
  } catch {}
}

pollServer();
