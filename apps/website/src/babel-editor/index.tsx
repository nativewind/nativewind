import React, { useMemo, useState } from "react";

import debounce from "lodash.debounce";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import { javascript } from "@codemirror/lang-javascript";
import { useColorMode } from "@docusaurus/theme-common";

const initialText = `import { Text } from "react-native";

export function MyFancyButton(props) {
  return (
    <Pressable className="component bg-violet-500 hover:bg-violet-600 active:bg-violet-700">
      <Text className="font-bold component-active:font-extrabold" {...props} />;
    </Pressable>
  );
}`;

const initialCompiledText = `import { NativeWindStyleSheet } from "nativewind";
import { StyledComponent } from "nativewind";

/* Example how your code will look */
import { Text } from "react-native";
export function MyFancyButton(props) {
  return <StyledComponent className="component bg-violet-500 hover:bg-violet-600 active:bg-violet-700" component={Pressable}>
      <StyledComponent className="font-bold component-active:font-extrabold" {...props} component={Text} />;
    </StyledComponent>;
}
NativeWindStyleSheet.create({
  styles: {
    "bg-violet-500": {
      "backgroundColor": "#8b5cf6"
    },
    "font-bold": {
      "fontWeight": "700"
    },
    "hover:bg-violet-600": {
      "backgroundColor": "#7c3aed"
    },
    "active:bg-violet-700": {
      "backgroundColor": "#6d28d9"
    }
  },
  masks: {
    "hover:bg-violet-600": 1,
    "active:bg-violet-700": 2
  }
});`;

export default function BabelEditor() {
  const { colorMode } = useColorMode();
  const [compiledText, setCompiledText] = useState(initialCompiledText);
  const update = useMemo(
    () =>
      debounce((code: string) => {
        fetch(
          `https://nativewind-demo-compiler.vercel.app/api/transform?a=${encodeURIComponent(
            code
          )}`
        )
          .then((response) => response.json())
          .then(({ body }) => {
            setCompiledText(body);
          });
      }, 1000),
    [setCompiledText]
  );

  return (
    <div className="babel-editor">
      <h4>Input</h4>
      <CodeMirror
        value={initialText}
        height="300px"
        extensions={[javascript({ jsx: true })]}
        theme={colorMode === "dark" ? dracula : eclipse}
        onChange={update}
      />
      <h4>Output</h4>
      <CodeMirror
        value={compiledText}
        editable={false}
        height="600px"
        extensions={[javascript({ jsx: true })]}
        theme={colorMode === "dark" ? dracula : eclipse}
      />
    </div>
  );
}
