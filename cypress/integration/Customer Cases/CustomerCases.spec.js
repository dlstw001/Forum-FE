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

  it('FILTERS', () => {
    const filters = data.filters;

    // Select sortBy_select
    cy.get('[data-cy="sortBy_select"]').as('sortBy_select');
    cy.get('@sortBy_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@sortBy_select')
      .find('.react-select__menu-list')
      .contains(filters.sort_by)
      .click({ force: true, multiple: true });

    // Select client
    cy.get('[data-cy="client_select"]').as('client_select');
    cy.get('@client_select').type(filters.client);
    cy.get('@client_select')
      .find('.react-select-async__menu-list')
      .contains(filters.client)
      .click({ force: true, multiple: true });

    // Select partner
    cy.get('[data-cy="partner_select"]').as('partner_select');
    cy.get('@partner_select').type(filters.partner);
    cy.get('@partner_select')
      .find('.react-select-async__menu-list')
      .contains(filters.partner)
      .click({ force: true, multiple: true });

    // reset
    cy.get('[data-cy=reset_btn]').click({ force: true, multiple: true });
  });

  it('FILTER BY TAG', () => {
    const filters = data.filters;

    // Select sortBy_select
    cy.get(`[data-cy='filter_tag_name_${filters.tag_name}']`).click({ force: true, multiple: true });

    // reset
    cy.get('[data-cy=reset_btn]').click({ force: true, multiple: true });
  });
});
