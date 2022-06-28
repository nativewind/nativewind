import React, { useMemo, useState } from "react";

import debounce from "lodash.debounce";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import { javascript } from "@codemirror/lang-javascript";
import { useColorMode } from "@docusaurus/theme-common";

const initialText = "console.log('hello world!');";

export default function BabelEditor() {
  const { colorMode } = useColorMode();
  const [text, setText] = useState(initialText);
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
            setText(body);
          });
      }),
    [setText]
  );

  return (
    <>
      <CodeMirror
        value={initialText}
        height="200px"
        extensions={[javascript({ jsx: true })]}
        theme={colorMode === "dark" ? dracula : eclipse}
        onChange={update}
      />

      <CodeMirror
        value={text}
        editable={false}
        height="200px"
        extensions={[javascript({ jsx: true })]}
        theme={colorMode === "dark" ? dracula : eclipse}
      />
    </>
  );
}
