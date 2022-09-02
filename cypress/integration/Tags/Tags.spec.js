describe('Tags.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=view_hamburger]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=hamburger_tags]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/tags').then((result) => {
      //verify the file data
      expect(result.create_tags_modal).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('SORT TAGS', () => {
    cy.get('select').select('Count').should('have.value', 'count');
    cy.get('select').select('Name').should('have.value', 'name');
  });

  it('DROPDOWN FUNCTIONS', () => {
    const create_tags_modal = data.create_tags_modal;

    // create tag
    cy.get('[data-cy=action_menu_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=create_tag_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=action_menu_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=create_tag_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=tag_title]').last().type(create_tags_modal.title, { force: true });
    cy.get('button[data-cy=confirm_btn]').first().click({ force: true, multiple: true });
    // delete tag
    cy.get('[data-cy=action_menu_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=delete_tag_btn]').click({ force: true, multiple: true });
    cy.get(`[data-cy="${create_tags_modal.delete_tag}_to_delete"]`).click({ force: true, multiple: true });
    cy.get('[data-cy=save_after_delete]').click({ force: true, multiple: true });
  });

  it('GO TO TOPIC LIST BY TAG', () => {
    cy.get('[data-cy=tag_itself]').first().click({ force: true, multiple: true });
  });
});
