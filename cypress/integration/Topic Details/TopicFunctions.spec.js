describe('TopicFunctions.spec', function () {
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

  it('TOPIC EDIT', () => {
    const topic_1 = data.topic_1;
    cy.get('[data-cy="topic_functions"]').click({ force: true });
    cy.get('[data-cy="topic_edit"]').click({ force: true });
    cy.get('input[data-cy="topic_title"]').last().type(topic_1.edit_topic_title);

    // submit
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });

  it('TOPIC DELETE', () => {
    cy.get('[data-cy="topic_delete"]').click({ force: true });
    cy.get('[data-cy="cancel_btn"]').click({ force: true });
    cy.get('[data-cy="topic_delete"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true });
  });

  it('TOPIC CLOSE', () => {
    cy.get('[data-cy="topic_openclose"]').click({ force: true });
    cy.get('[data-cy="cancel_btn"]').click({ force: true }); // close cancel
    cy.get('[data-cy="topic_openclose"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true }); // close

    cy.get('[data-cy="topic_openclose"]').click({ force: true });
    cy.get('[data-cy="cancel_btn"]').click({ force: true }); // open cancel
    cy.get('[data-cy="topic_openclose"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true }); // open
  });

  it('TOPIC ARCHIVE', () => {
    cy.get('[data-cy="topic_archiveunarchive"]').click({ force: true });
    cy.get('[data-cy="cancel_btn"]').click({ force: true }); // close cancel
    cy.get('[data-cy="topic_archiveunarchive"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true }); // close

    cy.get('[data-cy="topic_archiveunarchive"]').click({ force: true });
    cy.get('[data-cy="cancel_btn"]').click({ force: true }); // open cancel
    cy.get('[data-cy="topic_archiveunarchive"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true }); // open
  });

  it('TOPIC FLAG', () => {
    cy.get('[data-cy="topic_flag"]').click({ force: true });
    cy.get('[data-cy="cancel_btn"]').click({ force: true }); // close cancel
    cy.get('[data-cy="topic_flag"]').click({ force: true });
    cy.get('[data-cy="flag_off_topic"]').click({ force: true });
    cy.get('[data-cy="flag_inappropriate"]').click({ force: true });
    cy.get('[data-cy="flag_spam"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true }); // close
  });

  it('TOPIC SET TIMER', () => {
    const topic_1 = data.topic_1;

    cy.get('[data-cy="topic_timer"]').click({ force: true });

    // Select timer_type
    // In here, the contract element is created as shortcut that can be referred later
    cy.get('[data-cy="timer_type"]').as('timer_type');
    cy.get('@timer_type').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@timer_type')
      .find('.react-select__menu-list')
      .contains(topic_1.timer_type)
      .click({ force: true, multiple: true });

    // Select timer_time
    // In here, the contract element is created as shortcut that can be referred later
    cy.get('[data-cy="timer_time"]').as('timer_time');
    cy.get('@timer_time').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@timer_time')
      .find('.react-select__menu-list')
      .contains(topic_1.timer_time)
      .click({ force: true, multiple: true });

    if (topic_1.timer_time === 'Pick date and time') {
      // DATE
      cy.get('[data-cy="topic_timer_date"]').first().click();
      cy.get(`[aria-label='${topic_1.timer_custom_date}']`).click();

      // TIME
      cy.get('input[name="time"]').type(topic_1.timer_custom_hh_mm, { force: true });
    }

    if (topic_1.timer_time === 'Close based on last post') {
      // NUMBER OF HOURS
      cy.get('input[data-cy="noHourLastPost"]').last().type(topic_1.timer_custom_number_of_hours);
    }

    // set timer
    cy.get('[data-cy="set_timer_btn"]').click({ force: true }); // close
  });

  it('TOPIC PIN', () => {
    const topic_1 = data.topic_1;

    cy.get('[data-cy="topic_pin"]').click({ force: true });

    // Select pin_time
    // In here, the contract element is created as shortcut that can be referred later
    cy.get('[data-cy="pin_type"]').as('pin_time');
    cy.get('@pin_time').find('.react-select__value-container').last().click({ force: true, multiple: true });
    cy.get('@pin_time')
      .find('.react-select__menu-list')
      .contains(topic_1.pin_time)
      .click({ force: true, multiple: true });

    if (topic_1.pin_time === 'Pick date and time') {
      // DATE
      cy.get('[data-cy="topic_pin_date"]').first().click();
      cy.get(`[aria-label='${topic_1.pin_custom_date}']`).click();

      // TIME
      cy.get('input[name="time"]').type(topic_1.pin_custom_hh_mm, { force: true });
    }

    // set pin global
    // cy.get('[data-cy="set_global_pin_btn"]').click({ force: true });

    // set pin local
    cy.get('[data-cy="set_local_pin_btn"]').click({ force: true });
  });

  it('TOPIC UNPIN', () => {
    cy.get('[data-cy="topic_functions"]').click({ force: true });
    cy.get('[data-cy="topic_pin"]').click({ force: true });
  });

  it('TOPIC UNLIST', () => {
    cy.get('[data-cy="topic_listunlist"]').click({ force: true });
    cy.get('[data-cy="cancel_btn"]').click({ force: true }); // close cancel
    cy.get('[data-cy="topic_listunlist"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true }); // close

    cy.get('[data-cy="topic_listunlist"]').click({ force: true });
    cy.get('[data-cy="cancel_btn"]').click({ force: true }); // open cancel
    cy.get('[data-cy="topic_listunlist"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true }); // open
  });

  it('TOPIC CHANGE SECTION', () => {
    const topic_1 = data.topic_1;

    cy.get('[data-cy="topic_change_section"]').click({ force: true });

    // Select timer_time
    // In here, the contract element is created as shortcut that can be referred later
    cy.get('[data-cy="change_section_modal"]').as('change_section_modal');
    cy.get('@change_section_modal')
      .find('.react-select__value-container')
      .last()
      .click({ force: true, multiple: true });
    cy.get('@change_section_modal')
      .find('.react-select__menu-list')
      .contains(topic_1.change_section)
      .click({ force: true, multiple: true });

    cy.get('[data-cy="confirm_btn"]').click({ force: true });
  });

  it('TOPIC REVISION HISTORY', () => {
    cy.get('[data-cy="topic_revision_history"]').click({ force: true });
    cy.get('[data-cy="revision_edit_btn"]').click({ force: true });
    cy.get('[data-cy="cancel_btn"]').click({ force: true });

    cy.get('[data-cy="topic_revision_history"]').click({ force: true });
    cy.get('[data-cy="revision_revert_btn"]').click({ force: true });

    cy.get('[data-cy="topic_revision_history"]').click({ force: true });
    cy.get('[data-cy="revision_hide_btn"]').click({ force: true });
  });

  it('TOPIC MODERATION HISTORY', () => {
    cy.get('[data-cy="topic_moderation_history"]').click({ force: true });
  });
});
