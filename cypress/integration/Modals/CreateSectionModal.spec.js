describe('CreateSectionModal.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/modals').then((result) => {
      //verify the file data
      expect(result.create_section_modal).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('CREATE CATEGORY', () => {
    const create_section_modal = data.create_section_modal;

    // cancel
    cy.get('[data-cy=user_avatar]').should('be.visible').click({ force: true, multiple: true });
    cy.get('[data-cy=user_create_section]').should('exist').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });

    cy.get('[data-cy=user_avatar]').should('be.visible').click({ force: true, multiple: true });
    cy.get('[data-cy=user_create_section]').should('exist').click({ force: true, multiple: true });

    //title
    cy.get('[data-cy=modal_category_title]').last().type(create_section_modal.title);

    // parent
    if (create_section_modal.parent_section) {
      // Select parent
      // In here, the contract element is created as shortcut that can be referred later
      cy.get('[data-cy="select_parent"]').as('select_parent');
      cy.get('@select_parent').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@select_parent')
        .find('.react-select__menu-list')
        .contains(create_section_modal.parent_section)
        .click({ force: true, multiple: true });
    }

    // image
    const fileName = 'cy.png';
    cy.get('[data-cy="dropzone"]')
      .last()
      .trigger('dragenter', { force: true })
      .attachFile(fileName, { subjectType: 'drag-n-drop' });

    // description
    cy.get('[data-cy=description]').last().type(create_section_modal.description);

    // color
    cy.get('[data-cy=color_picker_modal]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_color_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=color_picker_modal]').click({ force: true, multiple: true });
    cy.get('[data-cy=confirm_color_btn]').click({ force: true, multiple: true });

    // Select crs_group
    create_section_modal.crs_group.forEach((lt) => {
      cy.get('[data-cy="crs_group"]').as('crs_group');
      cy.get('@crs_group').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@crs_group').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select rs_group
    create_section_modal.rs_group.forEach((lt) => {
      cy.get('[data-cy="rs_group"]').as('rs_group');
      cy.get('@rs_group').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@rs_group').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select s_group
    create_section_modal.s_group.forEach((lt) => {
      cy.get('[data-cy="s_group"]').as('s_group');
      cy.get('@s_group').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@s_group').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // moderation
    cy.get('[data-cy=approve_topics]').click({ force: true, multiple: true });
    cy.get('[data-cy=approve_topics]').click({ force: true, multiple: true });
    cy.get('[data-cy=approve_topics]').click({ force: true, multiple: true });
    cy.get('[data-cy=approve_replies]').click({ force: true, multiple: true });
    cy.get('[data-cy=approve_replies]').click({ force: true, multiple: true });

    // Select restriction
    create_section_modal.banned_tags.forEach((lt) => {
      cy.get('[data-cy="banned_tags"]').as('banned_tags');
      cy.get('@banned_tags').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@banned_tags').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // submit
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });

  it('DELETE SECTION', () => {
    cy.get('[data-cy="delete_sections_btn"]').click({ force: true });
    cy.get('[data-cy="confirm_btn"]').click({ force: true });
  });
});
