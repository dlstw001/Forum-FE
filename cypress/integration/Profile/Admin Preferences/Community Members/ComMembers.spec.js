describe('ComMembers.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_admin_com_members]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/admin-preferences').then((result) => {
      //verify the file data
      expect(result.community_members).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('SEARCHING', () => {
    const community_members = data.community_members;

    cy.get('[data-cy=search]').type(community_members.search_bar).clear();
    // all
    cy.get('[data-cy=tab_all]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(community_members.search_bar).clear();
    // admin
    cy.get('[data-cy=tab_admin]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(community_members.search_bar).clear();
    // moderator
    cy.get('[data-cy=tab_moderator]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(community_members.search_bar).clear();
    // new
    cy.get('[data-cy=tab_new]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(community_members.search_bar).clear();
    // suspended
    cy.get('[data-cy=tab_suspended]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(community_members.search_bar).clear();
    // silenced
    cy.get('[data-cy=tab_silenced]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(community_members.search_bar).clear();
  });
});
