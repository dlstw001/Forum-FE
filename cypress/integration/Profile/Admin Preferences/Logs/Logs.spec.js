describe('Logs.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_admin_logs]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/admin-preferences').then((result) => {
      //verify the file data
      expect(result.logs).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('SEARCHING', () => {
    const logs = data.logs;

    // staff
    cy.get('[data-cy=tab_staff]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(logs.search_staff_actions).clear();
    // emails
    cy.get('[data-cy=tab_emails]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(logs.search_screened_emails).clear();
    // ips
    cy.get('[data-cy=tab_ip]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(logs.search_screened_ips).clear();
    // urls
    cy.get('[data-cy=tab_url]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(logs.search_screened_urls).clear();
    // search
    cy.get('[data-cy=tab_search]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(logs.search_search_logs).clear();
    // error
    cy.get('[data-cy=tab_error]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(logs.search_error_logs).clear();
  });
});
