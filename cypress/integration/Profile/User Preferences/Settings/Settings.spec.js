describe('Settings.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_user_settings]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/user-preferences').then((result) => {
      //verify the file data
      expect(result.settings).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('EDIT NOTIFICATIONS', () => {
    // newTopic
    cy.get('[data-cy=newTopic_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=newTopic_email]').first().click({ force: true, multiple: true });

    // following
    cy.get('[data-cy=following_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=following_email]').first().click({ force: true, multiple: true });

    // messages
    cy.get('[data-cy=messages_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=messages_email]').first().click({ force: true, multiple: true });

    // mentions
    cy.get('[data-cy=mentions_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=mentions_email]').first().click({ force: true, multiple: true });

    // likes
    cy.get('[data-cy=likes_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=likes_email]').first().click({ force: true, multiple: true });
  });

  it('EDIT WATCHING PREFERENCES', () => {
    const settings = data.settings;

    // Select postDefaultLv
    // In here, the contract element is created as shortcut that can be referred later
    cy.get('[data-cy="postDefaultLv"]').as('postDefaultLv');
    cy.get('@postDefaultLv').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@postDefaultLv')
      .find('.react-select__menu-list')
      .contains(settings.postDefaultLv)
      .click({ force: true, multiple: true });

    // Select watchedCategories
    settings.watchedCategories.forEach((lt) => {
      cy.get('[data-cy="watchedCategories"]').as('watchedCategories');
      cy.get('@watchedCategories').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@watchedCategories').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select watchedFirstCategories
    settings.watchedFirstCategories.forEach((lt) => {
      cy.get('[data-cy="watchedFirstCategories"]').as('watchedFirstCategories');
      cy.get('@watchedFirstCategories')
        .find('.react-select__value-container')
        .last()
        .click({ force: true, multiple: true });
      cy.get('@watchedFirstCategories')
        .find('.react-select__menu-list')
        .contains(lt)
        .click({ force: true, multiple: true });
    });

    // Select mutedCategories
    settings.mutedCategories.forEach((lt) => {
      cy.get('[data-cy="mutedCategories"]').as('mutedCategories');
      cy.get('@mutedCategories').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@mutedCategories').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select watchedTags
    settings.watchedTags.forEach((lt) => {
      cy.get('[data-cy="watchedTags"]').as('watchedTags');
      cy.get('@watchedTags').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@watchedTags').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select watchedFirstTags
    settings.watchedFirstTags.forEach((lt) => {
      cy.get('[data-cy="watchedFirstTags"]').as('watchedFirstTags');
      cy.get('@watchedFirstTags').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@watchedFirstTags').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select mutedTags
    settings.mutedTags.forEach((lt) => {
      cy.get('[data-cy="mutedTags"]').as('mutedTags');
      cy.get('@mutedTags').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@mutedTags').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select ignoredUser
    settings.ignoredUser.forEach((lt) => {
      cy.get('[data-cy="ignoredUser"]').as('ignoredUser');
      cy.get('@ignoredUser').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@ignoredUser').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select mutedUser
    settings.mutedUser.forEach((lt) => {
      cy.get('[data-cy="mutedUser"]').as('mutedUser');
      cy.get('@mutedUser').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@mutedUser').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });
  });

  it('EDIT MESSAGES PREFERENCE', () => {
    cy.get('[data-cy=personal_message]').first().click({ force: true, multiple: true });
  });

  it('SAVE SETTINGS', () => {
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });

  it('REVERT CHANGES', () => {
    // newTopic
    cy.get('[data-cy=newTopic_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=newTopic_email]').first().click({ force: true, multiple: true });

    // following
    cy.get('[data-cy=following_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=following_email]').first().click({ force: true, multiple: true });

    // messages
    cy.get('[data-cy=messages_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=messages_email]').first().click({ force: true, multiple: true });

    // mentions
    cy.get('[data-cy=mentions_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=mentions_email]').first().click({ force: true, multiple: true });

    // likes
    cy.get('[data-cy=likes_web]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=likes_email]').first().click({ force: true, multiple: true });

    // Unselect watchedCategories
    cy.get('[data-cy="watchedCategories"]').as('watchedCategories');
    cy.get('@watchedCategories').find('.react-select__clear-indicator').last().click({ force: true, multiple: true });

    // Unselect watchedFirstCategories
    cy.get('[data-cy="watchedFirstCategories"]').as('watchedFirstCategories');
    cy.get('@watchedFirstCategories')
      .find('.react-select__clear-indicator')
      .last()
      .click({ force: true, multiple: true });

    // Unselect mutedCategories
    cy.get('[data-cy="mutedCategories"]').as('mutedCategories');
    cy.get('@mutedCategories').find('.react-select__clear-indicator').last().click({ force: true, multiple: true });

    // Unselect watchedTags
    cy.get('[data-cy="watchedTags"]').as('watchedTags');
    cy.get('@watchedTags').find('.react-select__clear-indicator').last().click({ force: true, multiple: true });

    // Unselect watchedFirstTags
    cy.get('[data-cy="watchedFirstTags"]').as('watchedFirstTags');
    cy.get('@watchedFirstTags').find('.react-select__clear-indicator').last().click({ force: true, multiple: true });

    // Unselect mutedTags
    cy.get('[data-cy="mutedTags"]').as('mutedTags');
    cy.get('@mutedTags').find('.react-select__clear-indicator').last().click({ force: true, multiple: true });

    // Unselect ignoredUser
    cy.get('[data-cy="ignoredUser"]').as('ignoredUser');
    cy.get('@ignoredUser').find('.react-select__clear-indicator').last().click({ force: true, multiple: true });

    // Unselect mutedUser
    cy.get('[data-cy="mutedUser"]').as('mutedUser');
    cy.get('@mutedUser').find('.react-select__clear-indicator').last().click({ force: true, multiple: true });

    // Message preferences
    cy.get('[data-cy=personal_message]').first().click({ force: true, multiple: true });

    // Save changes
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });
});
