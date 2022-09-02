describe('Review.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 3000 }).should('be.visible').click({ force: true, multiple: true });
    cy.get('[data-cy=user_review]').should('exist').click({ force: true, multiple: true });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/review').then((result) => {
      //verify the file data
      expect(result.filters).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('TABS', () => {
    cy.get('[data-cy=grouped_by_topic]').click({ force: true, multiple: true });
    cy.get('[data-cy=view_all]').click({ force: true, multiple: true });
  });

  it('FILTERS', () => {
    const filters = data.filters;

    // Select status_select
    cy.get('[data-cy="status_select"]').as('status_select');
    cy.get('@status_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@status_select')
      .find('.react-select__menu-list')
      .contains(filters.status_select)
      .click({ force: true, multiple: true });

    // Select category_select
    cy.get('[data-cy="category_select"]').as('category_select');
    cy.get('@category_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@category_select')
      .find('.react-select__menu-list')
      .contains(filters.category_select)
      .click({ force: true, multiple: true });

    // Select post_type_select
    cy.get('[data-cy="post_type_select"]').as('post_type_select');
    cy.get('@post_type_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@post_type_select')
      .find('.react-select__menu-list')
      .contains(filters.post_type_select)
      .click({ force: true, multiple: true });

    // Select reviewable_type_select
    cy.get('[data-cy="reviewable_type_select"]').as('reviewable_type_select');
    cy.get('@reviewable_type_select')
      .find('.react-select__value-container')
      .last()
      .click({ force: true, multiple: true });
    cy.get('@reviewable_type_select')
      .find('.react-select__menu-list')
      .contains(filters.reviewable_type_select)
      .click({ force: true, multiple: true });

    // Select minimum_priority_select
    cy.get('[data-cy="minimum_priority_select"]').as('minimum_priority_select');
    cy.get('@minimum_priority_select')
      .find('.react-select__value-container')
      .last()
      .click({ force: true, multiple: true });
    cy.get('@minimum_priority_select')
      .find('.react-select__menu-list')
      .contains(filters.minimum_priority_select)
      .click({ force: true, multiple: true });

    // Select review_by_select
    cy.get('[data-cy="review_by_select"]').as('review_by_select');
    cy.get('@review_by_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@review_by_select')
      .find('.react-select__menu-list')
      .contains(filters.review_by_select)
      .click({ force: true, multiple: true });

    // Select user_select
    cy.get('[data-cy="user_select"]').as('user_select');
    cy.get('@user_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@user_select')
      .find('.react-select__menu-list')
      .contains(filters.user_select)
      .click({ force: true, multiple: true });

    // DATE FROM
    cy.get('[data-cy="date_from"]').first().click();
    cy.get(`[aria-label='${filters.date_from}']`).click();

    // DATE TO
    cy.get('[data-cy="date_to"]').first().click();
    cy.get(`[aria-label='${filters.date_to}']`).click();

    // Select order_by_select
    cy.get('[data-cy="order_by_select"]').as('order_by_select');
    cy.get('@order_by_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@order_by_select')
      .find('.react-select__menu-list')
      .contains(filters.order_by_select)
      .click({ force: true, multiple: true });

    // reset
    cy.get('[data-cy=reset_btn]').click({ force: true, multiple: true });
  });

  it('GROUPED BY TOPIC', () => {
    cy.get('[data-cy=grouped_by_topic]').click({ force: true, multiple: true });
    cy.intercept('GET', 'http://10.8.18.23:4000/api/v1/reviewable/grouped?limit=1000').as('getComment');
    cy.get('[data-cy="details_btn"]').first().click();
  });

  it('DROPDOWN', () => {
    const topic_to_review = data.topic_to_review;

    cy.get('[data-cy=reset_btn]').click({ force: true, multiple: true });
    cy.get(`[data-cy="dropdown_menu_${topic_to_review.title}"]`).first().click();
    cy.get('[data-cy="approve_flag"]').first().click();
  });
});
