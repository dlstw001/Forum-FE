describe('Messages.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_user_preferences]').click({ force: true, multiple: true });
          cy.get('[data-cy=user_profile_messages]').click({ force: true, multiple: true });
        }
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

  it('SEARCHING', () => {
    const messages = data.messages;

    // inbox
    cy.get('[data-cy=messages_inbox_tab]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(messages.search_bar).clear();
    // sent
    cy.get('[data-cy=messages_sent_tab]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(messages.search_bar).clear();
    // archive
    cy.get('[data-cy=messages_archive_tab]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(messages.search_bar).clear();
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

  it('ARCHIVE MESSAGE', () => {
    cy.get('[data-cy=messages_sent_tab]').click({ force: true, multiple: true });
    cy.get('[data-cy=user_messages_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=archive_message_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=user_messages_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=archive_message_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=checkbox_in_table]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=archive_btn]').click({ force: true, multiple: true });
  });

  it('RESTORE MESSAGE', () => {
    cy.get('[data-cy=messages_archive_tab]').click({ force: true, multiple: true });
    cy.get('[data-cy=user_messages_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=archive_message_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=user_messages_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=archive_message_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=checkbox_in_table]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=restore_btn]').click({ force: true, multiple: true });
  });

  it('DELETE MESSAGE', () => {
    cy.get('[data-cy=messages_sent_tab]').click({ force: true, multiple: true });
    cy.get('[data-cy=user_messages_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=delete_message_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=user_messages_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=delete_message_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=checkbox_in_table]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=delete_btn]').click({ force: true, multiple: true });
  });
});
