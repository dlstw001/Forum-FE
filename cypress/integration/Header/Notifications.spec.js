describe('Notifications.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_notifications]', { timeout: 10000 }).click({ force: true, multiple: true });
  });

  it('GO TO ALL NOTIFICATIONS', () => {
    cy.get('[data-cy=notifications_view_all]').click({ force: true, multiple: true });
  });
});
