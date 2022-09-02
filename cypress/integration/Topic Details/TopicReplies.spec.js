describe('TopicReplies.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/topic-details').then((result) => {
      //verify the file data
      expect(result.topic_1).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('OPEN TOPIC', () => {
    const topic_1 = data.topic_1;
    cy.get(`[data-cy="${topic_1.topic_title}"]`).click({ force: true });
  });

  it('SORT REPLY', () => {
    cy.get('select').select('Sort By Newest').should('have.value', '1');
    cy.get('select').select('Sort By Favourites').should('have.value', '2');
  });

  it('CREATE REPLY', () => {
    const topic_1 = data.topic_1;

    cy.get('[data-cy="reply-editor-body"]').click({ force: true, multiple: true });
    cy.get('[data-cy="reply-editor-body"]').last().type(topic_1.reply);

    cy.get('[data-cy="create_reply"]').click({ force: true });
  });

  // it('REPLY TO REPLY', () => {});

  it('EDIT REPLY', () => {
    const topic_1 = data.topic_1;
    cy.get(`[data-cy="edit_reply_btn_${topic_1.reply}"]`).first().click();

    cy.get('[data-cy="reply-editor-body"]').click({ force: true, multiple: true });
    cy.get('[data-cy="reply-editor-body"]').last().click().focused().clear().type(topic_1.reply);

    cy.get('[data-cy="update_reply"]').click({ force: true });
  });

  it('LIKE/DISLIKE REPLY', () => {
    const topic_1 = data.topic_1;

    cy.get(`[data-cy="like_reply_btn_${topic_1.reply}"]`).first().click();
    cy.get(`[data-cy="like_reply_btn_${topic_1.reply}"]`).first().click();
  });

  it('SOLUTION REPLY', () => {
    const topic_1 = data.topic_1;

    cy.get(`[data-cy="solution_reply_btn_${topic_1.reply}"]`).first().click();
    cy.get(`[data-cy="solution_reply_btn_${topic_1.reply}"]`).first().click();
  });

  it('FLAG REPLY', () => {
    const topic_1 = data.topic_1;

    cy.get(`[data-cy="flag_reply_btn_${topic_1.reply}"]`).first().click();
    cy.get('[data-cy="cancel_btn"]').click({ force: true }); // close cancel
    cy.get(`[data-cy="flag_reply_btn_${topic_1.reply}"]`).first().click();
    cy.get('[data-cy="flag_off_topic"]').click({ force: true });
    cy.get('[data-cy="flag_inappropriate"]').click({ force: true });
    cy.get('[data-cy="flag_spam"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true }); // close
  });

  it('DELETE REPLY', () => {
    const topic_1 = data.topic_1;
    cy.get(`[data-cy="delete_reply_btn_${topic_1.reply}"]`).first().click();
  });
});
