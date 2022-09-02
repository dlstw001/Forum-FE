describe('Drafts.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_user_preferences]').click({ force: true, multiple: true });
          cy.get('[data-cy=user_profile_drafts]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/user-preferences').then((result) => {
      //verify the file data
      expect(result.drafts).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('DELETE DRAFT', () => {
    cy.get('[data-cy="action_menu_dropdown"]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=delete_draft_btn]').click({ force: true, multiple: true });
  });

  it('EDIT DRAFT', () => {
    const drafts = data.drafts;

    cy.get('[data-cy=draft_card]').first().click({ force: true, multiple: true });

    cy.get('body').then((body) => {
      if (body.find('[data-cy=header_modal]').length > 0) {
        cy.get('[data-cy="editor-body"]').click({ force: true, multiple: true });
        cy.get('[data-cy="editor-body"]').last().type(drafts.content);
      } else {
        cy.get('input[data-cy="topic_title"]').last().type(drafts.title);
        cy.get('[data-cy="editor-body"]').click({ force: true, multiple: true });
        cy.get('[data-cy="editor-body"]').last().type(drafts.content);

        // Select select_category
        // In here, the contract element is created as shortcut that can be referred later
        cy.get('[data-cy="select_category"]').as('select_category');
        cy.get('@select_category').find('.react-select__value-container').last().click({ force: true, multiple: true });
        cy.get('@select_category')
          .find('.react-select__menu-list')
          .contains(drafts.category_topic_modal)
          .click({ force: true, multiple: true });

        // Select select_tags
        drafts.tags_topic_modal.forEach((lt) => {
          cy.get('[data-cy="select_tags"]').as('select_tags');
          cy.get('@select_tags').find('.react-select__value-container').last().click({ force: true, multiple: true });
          cy.get('@select_tags').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
        });
      }
    });

    // submit
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });
});
