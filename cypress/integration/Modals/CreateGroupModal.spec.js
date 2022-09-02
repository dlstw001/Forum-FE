describe('CreateGroupModal.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=user_avatar]', { timeout: 10000 })
      .click({ force: true, multiple: true })
      .then((val) => {
        if (val) {
          cy.get('[data-cy=user_admin_com_groups]').click({ force: true, multiple: true });
        }
      });
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/modals').then((result) => {
      //verify the file data
      expect(result.create_group_modal).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('CREATE GROUP', () => {
    const create_group_modal = data.create_group_modal;

    // cancel
    cy.get('[data-cy=action_menu_dropdown]').should('exist').click({ force: true, multiple: true });
    cy.get('[data-cy=groups_create]').should('exist').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });

    cy.get('[data-cy=action_menu_dropdown]').should('exist').click({ force: true, multiple: true });
    cy.get('[data-cy=groups_create]').should('exist').click({ force: true, multiple: true });

    //title
    cy.get('[data-cy=modal_group_title]').last().type(create_group_modal.title);

    // image
    const fileName = 'cy.png';
    cy.get('[data-cy="dropzone"]')
      .last()
      .trigger('dragenter', { force: true })
      .attachFile(fileName, { subjectType: 'drag-n-drop' });

    // Select group owners
    create_group_modal.group_owners.forEach((lt) => {
      cy.get('[data-cy="group_owners"]').as('group_owners');
      cy.get('@group_owners').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@group_owners').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select group members
    create_group_modal.group_members.forEach((lt) => {
      cy.get('[data-cy="group_members"]').as('group_members');
      cy.get('@group_members').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@group_members').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // access
    cy.get('[data-cy=public_admission]').click({ force: true, multiple: true });
    cy.get('[data-cy=public_exit]').click({ force: true, multiple: true });
    cy.get('[data-cy=allow_membership_requests]').click({ force: true, multiple: true });

    // visibility
    if (create_group_modal.visibility_level) {
      // Select visibility level
      // In here, the contract element is created as shortcut that can be referred later
      cy.get('[data-cy="visibility_level"]').as('visibility_level');
      cy.get('@visibility_level').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@visibility_level')
        .find('.react-select__menu-list')
        .contains(create_group_modal.visibility_level)
        .click({ force: true, multiple: true });
    }
    if (create_group_modal.members_visibility_level) {
      // Select members visibility level
      // In here, the contract element is created as shortcut that can be referred later
      cy.get('[data-cy="members_visibility_level"]').as('members_visibility_level');
      cy.get('@members_visibility_level')
        .find('.react-select__value-container')
        .last()
        .click({ force: true, multiple: true });
      cy.get('@members_visibility_level')
        .find('.react-select__menu-list')
        .contains(create_group_modal.members_visibility_level)
        .click({ force: true, multiple: true });
    }

    // posting
    if (create_group_modal.mentionable_level) {
      // Select mentionable level
      // In here, the contract element is created as shortcut that can be referred later
      cy.get('[data-cy="mentionable_level"]').as('mentionable_level');
      cy.get('@mentionable_level').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@mentionable_level')
        .find('.react-select__menu-list')
        .contains(create_group_modal.mentionable_level)
        .click({ force: true, multiple: true });
    }
    if (create_group_modal.messageable_level) {
      // Select messageable level
      // In here, the contract element is created as shortcut that can be referred later
      cy.get('[data-cy="messageable_level"]').as('messageable_level');
      cy.get('@messageable_level').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@messageable_level')
        .find('.react-select__menu-list')
        .contains(create_group_modal.messageable_level)
        .click({ force: true, multiple: true });
    }

    // publish group
    cy.get('[data-cy=publish_read_state]').click({ force: true, multiple: true });

    // email
    cy.get('[data-cy=incoming_email]').last().type(create_group_modal.incoming_email);
    // Select parent
    // In here, the contract element is created as shortcut that can be referred later
    cy.get('[data-cy="default_notification_level"]').as('default_notification_level');
    cy.get('@default_notification_level')
      .find('.react-select__value-container')
      .last()
      .click({ force: true, multiple: true });
    cy.get('@default_notification_level')
      .find('.react-select__menu-list')
      .contains(create_group_modal.default_notification_level)
      .click({ force: true, multiple: true });

    // submit
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });

  it('DELETE GROUP', () => {
    // delete group
    cy.get('[data-cy=delete_group]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });
});
