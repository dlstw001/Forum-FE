Cypress.Commands.add('teardown', (keyword, fields, resource) => {
  const endpoint = `${Cypress.env('apiUrl')}/${resource}`;

  const searchParams = {
    keyword: `*${keyword}*`,
    fields: fields,
    size: 15,
    number: 0,
    sorts: [{ sortColumn: 'createdDate', sortDirection: 'DESC' }],
    matchQueryType: 'WILDCARD_MATCH',
  };

  cy.request({
    method: 'POST',
    body: searchParams,
    url: `${endpoint}/search`,
    headers: {
      Authorization: localStorage.getItem('FORUM'),
      Accept: 'application/json',
    },
  }).then(function (response) {
    const createdTestData = response.body.content;

    cy.log(`Found ${createdTestData.length} search result(s)`);

    if (createdTestData.length < 1) {
      cy.log('Nothing to Delete');
    } else {
      cy.log('Will start deleting items');
    }

    createdTestData.forEach(function (rma) {
      cy.request({
        method: 'DELETE',
        url: `${endpoint}/${rma.id}`,
        headers: {
          Authorization: localStorage.getItem('FORUM'),
          Accept: 'application/json',
        },
      });
    });
    cy.log('Teardown complete! :D ');
  });
});
