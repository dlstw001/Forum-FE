describe('FollowingTopics.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/following-topics').then((result) => {
      //verify the file data
      expect(result.topics).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('ADD FOLLOWING', () => {
    const topics = data.topics;
    cy.get(`[data-cy="topic_btn_follow_${topics.topic_title}"]`).first().click();
  });

  it('GO TO TOPIC', () => {
    cy.get('[data-cy=view_hamburger]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=hamburger_bookmarks]').click({ force: true, multiple: true });
        }
      });
  });

  it('UNFOLLOW TOPIC', () => {
    const topics = data.topics;
    cy.get(`[data-cy="${topics.topic_title}_action_menu_dropdown"]`).first().click({ force: true, multiple: true });
    cy.get('[data-cy=topic_unfollow_btn]').click({ force: true, multiple: true });
  });
});
