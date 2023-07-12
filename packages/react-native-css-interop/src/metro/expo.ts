export function expoColorSchemeWarning() {
  if (!isExpo()) {
    return;
  }

  const config = require("@expo/config").getConfig(process.cwd());

  if (config && config.exp.userInterfaceStyle === undefined) {
    console.warn(
      `Your Expo app does not have a 'userInterfaceStyle' setting which can to confusing color scheme behavior. Please set a 'userInterfaceStyle' to remove this warning (recommended 'automatic'). https://docs.expo.dev/develop/user-interface/color-themes`,
    );
  }
}

function isExpo() {
  try {
    require("@expo/config");
    return true;
  } catch {
    return false;
  }
}
