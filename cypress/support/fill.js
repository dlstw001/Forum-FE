Cypress.Commands.add('fill', { prevSubject: 'element' }, ($el, value) => {
  let nativeValueSetter

  if ($el.is('textArea')) {
    nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
  } else {
    nativeValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  }

  nativeValueSetter.call($el[0], value)
  $el[0].dispatchEvent(new Event('change', { value, bubbles: true }))
})
