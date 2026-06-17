describe('Home page spec', () => {
  it('API returns users', () => {
    cy.request('http://localhost:8000/users')
      .its('body')
      .should('have.length', 2)
  })
})
