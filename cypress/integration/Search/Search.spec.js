describe('Search.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy="search_bar"]').first().click();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/search').then((result) => {
      //verify the file data
      expect(result.search).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('NAVIGATE TO ADVANCED SEARCH PAGE', () => {
    const search = data.search;

    cy.get('[data-cy=search_input_value]').type(search.search_bar);
    cy.get('[data-cy=search_show_all]').should('exist').click({ force: true, multiple: true });
  });

  it('TABS', () => {
    // latest
    cy.get('[data-cy=latest]').click({ force: true, multiple: true });

    // hottest
    cy.get('[data-cy=hottest]').click({ force: true, multiple: true });

    // newest
    cy.get('[data-cy=newest]').click({ force: true, multiple: true });

    // most favs
    cy.get('[data-cy=most_fav]').click({ force: true, multiple: true });

    // most views
    cy.get('[data-cy=most_views]').click({ force: true, multiple: true });

    // most discuss
    cy.get('[data-cy=most_discuss]').click({ force: true, multiple: true });
  });

  it('FILTERS', () => {
    const search = data.search;

    cy.get('[data-cy=advanced_search_input_value]').clear().type(search.search_bar);

    cy.get('[data-cy="categories_select"]').as('categories_select');
    cy.get('@categories_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    // Select categories
    search.categories_select.forEach((lt) => {
      cy.get('@categories_select').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    cy.get('[data-cy="tags_select"]').as('tags_select');
    cy.get('@tags_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    // Select tags
    search.tags_select.forEach((lt) => {
      cy.get('@tags_select').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select date
    cy.get('[data-cy="date_select"]').as('date_select');
    cy.get('@date_select').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@date_select')
      .find('.react-select__menu-list')
      .contains(search.date_select)
      .click({ force: true, multiple: true });

    // reset button
    cy.get('[data-cy=reset_btn]').click({ force: true, multiple: true });
  });
});
