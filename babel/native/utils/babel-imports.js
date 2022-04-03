function appendImport(t, body, variable, source) {
  body.unshift(
    t.importDeclaration(
      [t.importSpecifier(t.identifier(variable), t.identifier(variable))],
      t.stringLiteral(source)
    )
  )
}

function hasImport(path, variable, source) {
  let match = false

  if (path.node.source.value === source) {
    path.traverse({
      Identifier(path) {
        if (path.key === 'local' && path.node.name === variable) {
          match = true
        }
      },
    })
  }
  return match
}

module.exports = {
  appendImport,
  hasImport,
}
