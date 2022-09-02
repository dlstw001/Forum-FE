describe('TopicItem.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/home').then((result) => {
      //verify the file data
      expect(result.test_topic).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('TOPIC CONTRIBUTOR LIST', () => {
    const test_topic = data.test_topic;
    cy.get(`[data-cy="topic_btn_contributor_list_${test_topic.title}"]`).first().click();
    cy.get('[data-cy="modal_close"]').first().click();
  });

  it('TOPIC LIKE LIST', () => {
    const test_topic = data.test_topic;
    cy.get(`[data-cy="topic_btn_like_list_${test_topic.title}"]`).first().click();
    cy.get('[data-cy="modal_close"]').first().click();
  });

  it('TOPIC ADD/REMOVE LIKE', () => {
    const test_topic = data.test_topic;
    cy.get(`[data-cy="topic_btn_like_${test_topic.title}"]`).click();
    cy.get(`[data-cy="topic_btn_like_${test_topic.title}"]`).click();
  });

  it('TOPIC OPEN/CLOSE SHARE', () => {
    const test_topic = data.test_topic;
    cy.get(`[data-cy="topic_btn_share_${test_topic.title}"]`).first().click();
    cy.get(`[data-cy="topic_btn_share_${test_topic.title}"]`).first().click();
  });

  it('TOPIC FOLLOW/UNFOLLOW', () => {
    const test_topic = data.test_topic;
    cy.get(`[data-cy="topic_btn_follow_${test_topic.title}"]`).first().click();
    cy.get(`[data-cy="topic_btn_follow_${test_topic.title}"]`).first().click();
  });

  it('TOPIC OPEN', () => {
    const test_topic = data.test_topic;
    cy.get(`[data-cy="${test_topic.title}"]`).first().click();
    cy.go('back');
  });

  it('TOPIC TAG OPEN', () => {
    const test_topic = data.test_topic;
    cy.get(`[data-cy="topic_tag_${test_topic.tag}"]`).first().click();
  });
});
