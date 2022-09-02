describe('Hamburger.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=view_hamburger]', { timeout: 10000 }).click({ force: true, multiple: true });
  });

  it('SECTIONS', () => {
    cy.get('[data-cy=hamburger_sections]').should('exist').click({ force: true, multiple: true });
  });

  it('CUSTOMER CASES', () => {
    cy.get('[data-cy=hamburger_customer_cases]').should('exist').click({ force: true, multiple: true });
  });

  it('TAGS', () => {
    cy.get('[data-cy=hamburger_tags]').should('exist').click({ force: true, multiple: true });
  });

  it('BOOKMARKS', () => {
    cy.get('[data-cy=hamburger_bookmarks]').should('exist').click({ force: true, multiple: true });
  });

  it('DRAFTS', () => {
    cy.get('[data-cy=hamburger_drafts]').should('exist').click({ force: true, multiple: true });
  });

  it('MESSAGES', () => {
    cy.get('[data-cy=hamburger_messages]').should('exist').click({ force: true, multiple: true });
  });

  it('TUTORIAL', () => {
    cy.get('[data-cy=hamburger_tutorial]').should('exist').click({ force: true, multiple: true });
  });

  it('SHORTCUTS', () => {
    cy.get('[data-cy=hamburger_keyboard_shortcut]').should('exist').click({ force: true, multiple: true });
  });
});
