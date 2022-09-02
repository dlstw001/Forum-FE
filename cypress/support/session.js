let FORUM = null;

Cypress.Commands.add('restoreLogin', () => {
  //Check if token is locally cached
  if (FORUM) {
    //Set cached token to localStorage
    localStorage.setItem('FORUM', FORUM);
  }
});

Cypress.Commands.add('saveLogin', () => {
  //Cached the auth token
  FORUM = localStorage.getItem('FORUM');
});
