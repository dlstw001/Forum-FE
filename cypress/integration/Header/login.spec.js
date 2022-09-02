describe('Login.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
  });

  it('LOGOUT', () => {
    cy.get('[data-cy=user_avatar]').should('exist').click({ force: true, multiple: true });
    cy.get('[data-cy=user_logout]').should('exist').click({ force: true, multiple: true });
  });
});
