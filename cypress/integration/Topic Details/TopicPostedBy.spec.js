describe('TopicPostedBy.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/topic').then((result) => {
      //verify the file data
      expect(result.topic_posted_by).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('OPEN TOPIC', () => {
    const topic_posted_by = data.topic_posted_by;
    cy.get(`[data-cy="${topic_posted_by.topic_title}"]`).click({ force: true });
  });

  it('TOPIC CONTRIBUTOR LIST', () => {
    const topic_posted_by = data.topic_posted_by;
    cy.get(`[data-cy="topic_btn_contributor_list_${topic_posted_by.topic_title}"]`).first().click({ force: true });
    cy.get('[data-cy="modal_close"]').first().click({ force: true });
  });

  it('TOPIC LIKE LIST', () => {
    const topic_posted_by = data.topic_posted_by;
    cy.get(`[data-cy="topic_btn_like_list_${topic_posted_by.topic_title}"]`).first().click({ force: true });
    cy.get('[data-cy="modal_close"]').first().click({ force: true });
  });

  it('TOPIC ADD/REMOVE LIKE', () => {
    const topic_posted_by = data.topic_posted_by;
    cy.get(`[data-cy="topic_btn_like_${topic_posted_by.topic_title}"]`).click({ multiple: true, force: true });
    cy.get(`[data-cy="topic_btn_like_${topic_posted_by.topic_title}"]`).click({ multiple: true, force: true });
  });

  it('TOPIC OPEN/CLOSE SHARE', () => {
    cy.get(`[data-cy="topic_btn_share"]`).first().click({ force: true });
    cy.get(`[data-cy="topic_btn_share"]`).first().click({ force: true });
  });

  it('TOPIC FOLLOW/UNFOLLOW', () => {
    cy.get(`[data-cy="topic_btn_follow"]`).first().click({ force: true });
    cy.get(`[data-cy="topic_btn_follow"]`).first().click({ force: true });
  });
});
