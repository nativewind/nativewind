import { Platform } from "react-native";
import { injectData } from "./$$styles";

const { url } = require("react-native/Libraries/Core/Devtools/getDevServer")();

async function pollServer(version = 0) {
  try {
    const response = await fetch(
      `${url}__css_interop_update_endpoint?version=${version}&platform=${Platform.OS}`,
    );

    if (response.status == 502) {
      // Status 502 is a connection timeout error,
      // may happen when the connection was pending for too long,
      // and the remote server or a proxy closed it
      // let's reconnect
      return pollServer(version);
    } else if (response.status != 200) {
      // Reconnect in one second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await pollServer(version);
    } else {
      if (!response.ok) {
        console.error(
          "Received non-ok response from react-native-css-interop Metro server",
        );
      }
      const body = await response.text();

      if (body.startsWith("data: ")) {
        const contents = JSON.parse(body.replace("data: ", ""));
        version = contents.version;
        injectData(contents.data);
      }

      return pollServer(version);
    }
  } catch (error: any) {
    console.error(
      "There was a problem connecting to the react-native-css-interop Metro server",
    );
  }
}

pollServer();
