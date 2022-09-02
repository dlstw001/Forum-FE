describe('CreateTopicModal.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/modals').then((result) => {
      //verify the file data
      expect(result.create_topic_modal).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('CREATE TOPIC', () => {
    const create_topic_modal = data.create_topic_modal;

    cy.get('[data-cy=user_avatar]').should('be.visible').click({ force: true, multiple: true });
    cy.get('[data-cy=user_create_topic]').should('exist').click({ force: true, multiple: true });
    cy.get('input[data-cy="topic_title"]').last().type(create_topic_modal.title);
    cy.get('[data-cy="editor-body"]').click({ force: true, multiple: true });
    cy.get('[data-cy="editor-body"]').last().type(create_topic_modal.content);

    // Select select_category
    // In here, the contract element is created as shortcut that can be referred later
    cy.get('[data-cy="select_category"]').as('select_category');
    cy.get('@select_category').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@select_category')
      .find('.react-select__menu-list')
      .contains(create_topic_modal.category_topic_modal)
      .click({ force: true, multiple: true });

    // Select select_tags
    create_topic_modal.tags_topic_modal.forEach((lt) => {
      cy.get('[data-cy="select_tags"]').as('select_tags');
      cy.get('@select_tags').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@select_tags').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // submit
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });

  it('DELETE TOPIC', () => {
    cy.get('[data-cy="topic_delete"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true });
  });
});
