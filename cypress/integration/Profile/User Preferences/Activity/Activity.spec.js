describe('Activity.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_user_preferences]').click({ force: true, multiple: true });
          cy.get('[data-cy=user_profile_activity]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/user-preferences').then((result) => {
      //verify the file data
      expect(result.activity).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('SEARCHING', () => {
    const activity = data.activity;

    // post
    cy.get('[data-cy=activity_post_tab]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(activity.search_bar).clear();
    // like
    cy.get('[data-cy=activity_like_tab]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(activity.search_bar).clear();
    // reply
    cy.get('[data-cy=activity_reply_tab]').click({ force: true, multiple: true });
    cy.get('[data-cy=search]').type(activity.search_bar).clear();
  });
});
