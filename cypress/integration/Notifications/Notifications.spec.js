describe('Notifications.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_user_preferences]').click({ force: true, multiple: true });
          cy.get('[data-cy=user_profile_notifications]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/user-preferences').then((result) => {
      //verify the file data
      expect(result.activity).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('SELECT ALL', () => {
    cy.get('[data-cy=select_all]').click({ force: true, multiple: true });
    cy.get('[data-cy=select_all]').click({ force: true, multiple: true });
  });

  it('SELECT ONE', () => {
    const notifications = data.notifications;
    cy.get(`[data-cy='${notifications.check_element}']`).click({ force: true, multiple: true });
    cy.get(`[data-cy='${notifications.check_element}']`).click({ force: true, multiple: true });
  });

  it('SELECT TO READ', () => {
    const notifications = data.notifications;
    cy.get(`[data-cy='${notifications.to_read}']`).click({ force: true, multiple: true });
    // cy.get('[data-cy=delete_btn]').click({ force: true, multiple: true });
  });

  it('SELECT TO DELETE', () => {
    const notifications = data.notifications;
    cy.get(`[data-cy='${notifications.to_delete}']`).click({ force: true, multiple: true });
    // cy.get('[data-cy=read_btn]').click({ force: true, multiple: true });
  });
});
