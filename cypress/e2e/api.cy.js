describe('API - GET /users', () => {
  it('retourne un tableau d utilisateurs', () => {
    cy.request('http://localhost:8000/users').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')
    })
  })
})

describe('API - POST /login', () => {
  it('retourne 401 avec identifiants invalides - cas erreur', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/login',
      body: { identifiant: 'wrong', mdp: 'wrong' },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401)
    })
  })
})
