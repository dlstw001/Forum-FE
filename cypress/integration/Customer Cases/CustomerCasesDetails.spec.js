describe('CustomerCases.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=view_hamburger]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=hamburger_customer_cases]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/customer-cases').then((result) => {
      //verify the file data
      expect(result.filters).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('OPEN', () => {
    const topic_open = data.topic_open;
    cy.get(`[data-cy="customer_case_${topic_open.title}"]`).first().click();
  });
});
