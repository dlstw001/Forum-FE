Cypress.Commands.add('login', () => {
  //Always set the title and description of a custom command
  const log = Cypress.log({
    name: 'login',
    message: 'Login to FORUM',
  });

  //Check if auth token exists
  const token = localStorage.getItem('FORUM');
  if (token) {
    //Just simply visit homepage
    cy.log('Already login');
    cy.visit('http://localhost:3000/');
  } else {
    //Login if auth token does not exists
    cy.visit('http://localhost:3000/login');
    cy.contains('Test Login')
      .click({ log: false })
      .then(($el) => {
        // we didn't know $el until now. `.set` allows us to update later.
        // `.snapshot()` tells Cypress to create a DOM snapshot for debugging
        // `.end()` tells Cypress this command has completed.
        // When a command starts and stops determines the loading indicator that shows for every command as Cypress runs
        log.set({ $el }).snapshot().end();
      });

    //Validate user's login
    cy.get('[data-cy="user_avatar"]').should('exist');
  }
});
