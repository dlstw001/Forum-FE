describe('CreateCustomerCase.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/modals
    cy.fixture('testData/modals').then((result) => {
      //verify the file data
      expect(result.create_customer_case_modal).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('CREATE CUSTOMER CASE', () => {
    const create_customer_case_modal = data.create_customer_case_modal;

    cy.get('[data-cy=user_avatar]').should('be.visible').click({ force: true, multiple: true });
    cy.get('[data-cy=user_create_customer_case]').should('exist').click({ force: true, multiple: true });

    // Banner Image
    const bannerName = 'cy.png';
    cy.get('[data-cy="banner_image"]')
      .last()
      .trigger('dragenter', { force: true })
      .attachFile(bannerName, { subjectType: 'drag-n-drop' });

    // Featured Image
    const featuredName = 'cy.png';
    cy.get('[data-cy="featured_image"]')
      .last()
      .trigger('dragenter', { force: true })
      .attachFile(featuredName, { subjectType: 'drag-n-drop' });

    cy.get('input[data-cy="customer_case_name"]').last().type(create_customer_case_modal.name);

    cy.get('[data-cy="customer_case_content"]').click({ force: true, multiple: true });
    cy.get('[data-cy="customer_case_content"]').last().type(create_customer_case_modal.content);

    // Select client
    cy.get('[data-cy="customer_case_client"]').as('customer_case_client');
    cy.get('@customer_case_client')
      .find('.react-select-async-creatable__value-container')
      .last()
      .click({ force: true, multiple: true })
      .type(create_customer_case_modal.client);
    cy.get('@customer_case_client')
      .find('.react-select-async-creatable__menu-list')
      .contains(create_customer_case_modal.client)
      .click({ force: true, multiple: true });

    // Select partner
    cy.get('[data-cy="customer_case_partner"]').as('customer_case_partner');
    cy.get('@customer_case_partner')
      .find('.react-select-async-creatable__value-container')
      .last()
      .click({ force: true, multiple: true })
      .type(create_customer_case_modal.partner);
    cy.get('@customer_case_partner')
      .find('.react-select-async-creatable__menu-list')
      .contains(create_customer_case_modal.partner)
      .click({ force: true, multiple: true });

    // Select tags
    cy.get('[data-cy="customer_case_tags"]').as('customer_case_tags');
    cy.get('@customer_case_tags')
      .find('.react-select-async-creatable__value-container')
      .last()
      .click({ force: true, multiple: true })
      .type(create_customer_case_modal.tags);
    cy.get('@customer_case_tags')
      .find('.react-select-async-creatable__menu-list')
      .contains(create_customer_case_modal.tags)
      .click({ force: true, multiple: true });

    // url
    cy.get('input[data-cy="customer_case_url"]').last().type(create_customer_case_modal.url);

    // submit
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });
});
