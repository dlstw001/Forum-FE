describe('Profile.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_user_preferences]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/user-preferences').then((result) => {
      //verify the file data
      expect(result.profile).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('EDIT PROFILE', () => {
    const profile = data.profile;

    // cancel
    cy.get('[data-cy=user_profile_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=edit_profile_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });

    cy.get('[data-cy=user_profile_dropdown]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=edit_profile_btn]').click({ force: true, multiple: true });

    cy.get('[data-cy="about-me"]').click({ force: true, multiple: true });
    cy.get('[data-cy="about-me"]').last().click().focused().clear().type(profile.about_me);
    cy.get('[data-cy=location]').type(profile.location);
    cy.get('[data-cy=website]').type(profile.website);
    // Select select_category
    // In here, the contract element is created as shortcut that can be referred later
    cy.get('[data-cy="select_timezone"]').as('select_timezone');
    cy.get('@select_timezone').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@select_timezone')
      .find('.react-select__menu-list')
      .contains(profile.timezone)
      .click({ force: true, multiple: true });

    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });
});
