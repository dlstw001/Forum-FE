describe('Home.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/home').then((result) => {
      //verify the file data
      expect(result.tags).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('TRENDING SECTION', function () {
    cy.get('[data-cy=section_view_all]').click();
    cy.go('back');
  });

  it('TOPICS FILTER', () => {
    const tags = data.tags;

    cy.get('[data-cy=homepage_latest]').click();
    cy.get('[data-cy=homepage_hottest]').click();
    cy.get('[data-cy=homepage_newest]').click();
    cy.get('[data-cy=homepage_unread]').click();
    cy.get('[data-cy=homepage_tags]').click();

    // Select select_tag
    cy.get('.react-select__control').as('select_tag');
    cy.get('@select_tag').find('.react-select__value-container').last().click({ force: true, multiple: true });

    cy.get('.react-select__menu').as('select_tag_menu');
    cy.get('@select_tag_menu')
      .find('.react-select__menu-list')
      .contains(tags.title)
      .click({ force: true, multiple: true });
    cy.go('back');

    cy.get('[data-cy=topics_view_all]').click();
    cy.go('back');
  });
});
