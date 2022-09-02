// eslint-disable-next-line prettier/prettier
Cypress.Commands.overwrite('type', (fn, subject, string, options) =>
  fn(subject, string, Object.assign({}, options, { delay: 1 }))
)
