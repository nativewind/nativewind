const template = require('@babel/template').default

const variableAst = template(`
const __tailwindStyles = StyleSheet.create(STYLES);
const __tailwindMedia = MEDIA;
`)

function appendVariables(body, styles, media) {
  variableAst({
    STYLES: styles,
    MEDIA: media,
  }).forEach((ast) => {
    body.push(ast)
  })
}

module.exports = appendVariables
