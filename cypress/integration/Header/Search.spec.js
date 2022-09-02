describe('Search.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy="search_bar"]').first().click();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/header').then((result) => {
      //verify the file data
      expect(result.header).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('SEARCHING', () => {
    const header = data.header;

    cy.get('[data-cy=search_input_value]').type(header.search_bar).clear();
  });
});
