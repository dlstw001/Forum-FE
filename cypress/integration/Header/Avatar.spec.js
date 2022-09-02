describe('Avatar.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 3000 }).should('be.visible').click({ force: true, multiple: true });
  });

  it('CREATE SECTION', () => {
    cy.get('[data-cy=user_create_section]').should('exist').click({ force: true, multiple: true });
  });

  it('CREATE TOPIC', () => {
    cy.get('[data-cy=user_create_topic]').should('exist').click({ force: true, multiple: true });
  });

  it('CREATE CUSTOMER CASE', () => {
    cy.get('[data-cy=user_create_customer_case]').should('exist').click({ force: true, multiple: true });
  });

  it('CREATE MESSAGE', () => {
    cy.get('[data-cy=user_create_message]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN ADMIN DASHBOARD', () => {
    cy.get('[data-cy=user_admin_dashboard]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN COMMUNITY GROUPS', () => {
    cy.get('[data-cy=user_admin_com_groups]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN COMMUNITY MEMBERS', () => {
    cy.get('[data-cy=user_avatar]', { timeout: 3000 }).should('be.visible').click({ force: true, multiple: true });
    cy.get('[data-cy=user_admin_com_members]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN LOGS', () => {
    cy.get('[data-cy=user_admin_logs]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN BACKUPS', () => {
    cy.get('[data-cy=user_admin_backups]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN REVIEW', () => {
    cy.get('[data-cy=user_review]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN PROFILE', () => {
    cy.get('[data-cy=user_user_preferences]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN ACTIVITY', () => {
    cy.get('[data-cy=user_user_activity]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN SETTINGS', () => {
    cy.get('[data-cy=user_user_settings]').should('exist').click({ force: true, multiple: true });
  });

  it('OPEN LOGOUT', () => {
    cy.get('[data-cy=user_logout]').should('exist').click({ force: true, multiple: true });
  });
});
