describe('Categories.spec', function () {
  it('Login and fetch data', function () {
    Cypress.currentTest;
    cy.login();
    cy.get('[data-cy=section_view_all]').click();
    cy.get('[data-cy=section-title]').should('be.visible');
  });

  let data = {};
  it('Fetch test data', function () {
    //Fetch data from testData/contact
    cy.fixture('testData/modals').then((result) => {
      //verify the file data
      expect(result.section_edit_modal).to.exist;

      //Store data in a variable to be used later
      data = result;
    });
  });

  it('REORDER SECTIONS', function () {
    const section_settings = data.section_settings;

    cy.get('[data-cy="action_menu_dropdown"]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=reorder_sections_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });

    cy.get('[data-cy="action_menu_dropdown"]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=reorder_sections_btn]').click({ force: true, multiple: true });

    cy.get(`[data-cy=section-title_${section_settings.reorder_from}]`).first().trigger('dragstart');
    cy.get(`[data-cy=section-title_${section_settings.reorder_to}]`).last().trigger('drop');

    // cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });

  it('DELETE SECTIONS', function () {
    // const section_settings = data.section_settings;

    cy.get('[data-cy="action_menu_dropdown"]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=delete_sections_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });

    // cy.get('[data-cy="action_menu_dropdown"]').first().click({ force: true, multiple: true });
    // cy.get('[data-cy=delete_sections_btn]').click({ force: true, multiple: true });
    // cy.get(`[data-cy=delete_category_card_${section_settings.category_to_delete}]`)
    // .click({ force: true, multiple: true });
    // cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });

  it('DELETE PARENT SECTION', function () {
    const section_settings = data.section_settings;

    cy.get('[data-cy="action_menu_dropdown"]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=delete_sections_btn]').click({ force: true, multiple: true });

    // cancel
    cy.get('[data-cy=delete_category_card]').eq(4).click({ force: true, multiple: true });
    // change section modal
    cy.get('[data-cy="subcategory_change_parent"]').as('subcategory_change_parent');
    cy.get('@subcategory_change_parent')
      .find('.react-select__value-container')
      .last()
      .click({ force: true, multiple: true });
    cy.get('@subcategory_change_parent')
      .find('.react-select__menu-list')
      .contains(section_settings.parent_section)
      .click({ force: true, multiple: true });
    // cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });

  it('EDIT PARENT SECTION', function () {
    const section_edit_modal = data.section_edit_modal;
    cy.contains('Product Discussion').click({ force: true, multiple: true });
    cy.get('[data-cy="action_menu_dropdown"]').first().click({ force: true, multiple: true });
    cy.get('[data-cy=edit_section_btn]').click({ force: true, multiple: true });

    //title
    cy.get('[data-cy=modal_category_title]').last().type(section_edit_modal.title);

    // parent
    if (section_edit_modal.parent_section) {
      // Select parent
      // In here, the contract element is created as shortcut that can be referred later
      cy.get('[data-cy="select_parent"]').as('select_parent');
      cy.get('@select_parent').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@select_parent')
        .find('.react-select__menu-list')
        .contains(section_edit_modal.parent_section)
        .click({ force: true, multiple: true });
    }

    // image
    const fileName = 'cy.png';
    cy.get('[data-cy="dropzone"]')
      .last()
      .trigger('dragenter', { force: true })
      .attachFile(fileName, { subjectType: 'drag-n-drop' });

    // description
    cy.get('[data-cy=description]').last().type(section_edit_modal.description);

    // color
    cy.get('[data-cy=color_picker_modal]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_color_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=color_picker_modal]').click({ force: true, multiple: true });
    cy.get('[data-cy=confirm_color_btn]').click({ force: true, multiple: true });

    // Select crs_group
    section_edit_modal.crs_group.forEach((lt) => {
      cy.get('[data-cy="crs_group"]').as('crs_group');
      cy.get('@crs_group').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@crs_group').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select rs_group
    section_edit_modal.rs_group.forEach((lt) => {
      cy.get('[data-cy="rs_group"]').as('rs_group');
      cy.get('@rs_group').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@rs_group').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // Select s_group
    section_edit_modal.s_group.forEach((lt) => {
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
    section_edit_modal.banned_tags.forEach((lt) => {
      cy.get('[data-cy="banned_tags"]').as('banned_tags');
      cy.get('@banned_tags').find('.react-select__value-container').last().click({ force: true, multiple: true });
      cy.get('@banned_tags').find('.react-select__menu-list').contains(lt).click({ force: true, multiple: true });
    });

    // submit
    cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });

  it('DELETE SECTION', function () {
    cy.contains('Announcements').click({ force: true, multiple: true });
    cy.get('[data-cy=delete_sections_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=cancel_btn]').click({ force: true, multiple: true });
    cy.get('[data-cy=delete_sections_btn]').click({ force: true, multiple: true });
    // cy.get('[data-cy=confirm_btn]').click({ force: true, multiple: true });
  });
});
