# Editor Setup

Please refer to the [documentation on the Tailwind CSS website](https://tailwindcss.com/docs/editor-setup) for more information.

## IntelliSense for VS Code

In order to make the most of the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension for Visual Studio Code in a React Native scenario:
- Make sure it checks `.jsx` and `.tsx` files by updating the `tailwindCSS.includeLanguages` property _(see below)_
- Add the `style` class attribute _if you're using it_.

Here's an example updated `Settings.json` file for VS Code: 

```json
{
  (...)
  "tailwindCSS.includeLanguages": {
    "typescriptreact": "html",
    "javascriptreact": "html"
  },
  "tailwindCSS.classAttributes": [
    "class",
    "className",
    "ngClass",
    "style"
  ]
}
```
