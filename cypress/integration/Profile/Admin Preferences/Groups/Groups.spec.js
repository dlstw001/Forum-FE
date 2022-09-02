describe('Groups.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_admin_com_groups]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/admin-preferences').then((result) => {
      //verify the file data
      expect(result.groups).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('SEARCHING', () => {
    const groups = data.groups;

    cy.get('[data-cy=search]').type(groups.search_bar).clear();
    cy.get('select').select('My Groups').should('have.value', '1');
    cy.get('select').select('Groups I own').should('have.value', '2');
    cy.get('select').select('Public Groups').should('have.value', '3');
    cy.get('select').select('Closed Groups').should('have.value', '4');
    cy.get('select').select('Automatic Groups').should('have.value', '5');
    cy.get('select').select('All').should('have.value', '0');
  });

  it('DROPDOWN', () => {
    cy.get('[data-cy="action_menu_dropdown"]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=groups_create]').click({ force: true, multiple: true });
  });

  it('GROUP DETAILS', () => {
    const groups = data.groups;
    cy.get(`[data-cy="${groups.to_edit}"]`).click({ force: true, multiple: true });

    // members
    cy.get('[data-cy=members]').click({ force: true, multiple: true });

    // activity
    cy.get('[data-cy=activity]').click({ force: true, multiple: true });

    // permissions
    cy.get('[data-cy=permissions]').click({ force: true, multiple: true });
  });

  it('GROUP FUNCTIONS', () => {
    const groups = data.groups;

    cy.get('[data-cy=group_details_dropdown]').first().click({ force: true, multiple: true });

    // manage members
    cy.get('[data-cy=manage_members]').first().click({ force: true, multiple: true });
    // Select select_users
    groups.members.forEach((lt) => {
      cy.get('[data-cy="select_users"]').as('select_users');
      cy.get('@select_users').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@select_users').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });

    // manage group
    cy.get('[data-cy=group_details_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=manage_group]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });

    // delete group
    cy.get('[data-cy=group_details_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=delete_group]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=group_details_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=delete_group]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });
});
