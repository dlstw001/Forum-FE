describe('CreateMessageModal.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    it('CREATE MESSAGE', () => {
      cy.get('[data-cy=user_create_message]').should('exist').click({ force: true, multiple: true });
    });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/user-preferences').then((result) => {
      //verify the file data
      expect(result.messages).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('CREATE MESSAGE', () => {
    const messages = data.messages;

    cy.get('[data-cy=user_messages_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=create_message_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=user_messages_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=create_message_btn]').click({ force: true, multiple: true });

    // Select target_user
    cy.get('[data-cy="create_to"]').as('create_to');
    cy.get('@create_to').type(messages.create_to);
    cy.get('@create_to')
      .find('.react-select-async__menu-list')
      .contains(messages.create_to)
      .click({ force: true, multiple: true });

    cy.get('[data-cy=title]').type(messages.create_title);

    cy.get('[data-cy="editor-body"]').click({ force: true, multiple: true });
    cy.get('[data-cy="editor-body"]').last().type(messages.create_description);

    cy.get('[data-cy=create_btn]').click({ force: true, multiple: true });
  });
});
