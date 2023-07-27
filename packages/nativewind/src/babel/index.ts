import ensureImportSource from "./ensure-import-source";

export default function () {
  return {
    plugins: [ensureImportSource],
  };
}
