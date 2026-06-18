describe('Liste des utilisateurs', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8000/users', { fixture: 'users.json' }).as('getUsers')
    cy.visit('/')
    cy.wait('@getUsers')
  })

  it('affiche la liste dès la page chargée', () => {
    cy.get('table').should('be.visible')
    cy.contains('Liste des utilisateurs (2)').should('be.visible')
  })

  it('affiche le nom et prénom des utilisateurs', () => {
    cy.contains('td', 'Doe').should('be.visible')
    cy.contains('td', 'Fenoll').should('be.visible')
  })

  it('n affiche pas les colonnes privées sans connexion', () => {
    cy.contains('th', 'Identifiant').should('not.exist')
    cy.contains('button', 'Supprimer').should('not.exist')
  })

  it('affiche une liste vide si l API est indisponible', () => {
    cy.intercept('GET', 'http://localhost:8000/users', { forceNetworkError: true })
    cy.visit('/')
    cy.contains('Liste des utilisateurs (0)').should('be.visible')
  })
})

describe('Connexion', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8000/users', { fixture: 'users.json' })
    cy.visit('/')
    cy.contains('button', 'Connexion').click()
  })

  it('ouvre la popup de connexion', () => {
    cy.get('.modal-overlay').should('be.visible')
    cy.get('#identifiant').should('exist')
    cy.get('#mdp').should('exist')
  })

  it('le bouton est désactivé si les champs sont vides', () => {
    cy.contains('button', 'Se connecter').should('be.disabled')
  })

  it('connexion réussie redirige vers la liste', () => {
    cy.intercept('POST', 'http://localhost:8000/login', {
      statusCode: 200,
      body: { id: 1, nom: 'Admin', prenom: 'System', identifiant: 'admin', is_admin: true },
    }).as('login')

    cy.get('#identifiant').type('admin')
    cy.get('#mdp').type('admin')
    cy.contains('button', 'Se connecter').click()
    cy.wait('@login')

    cy.contains('button', 'Déconnexion').should('be.visible')
    cy.get('.modal-overlay').should('not.exist')
  })

  it('affiche une erreur si les identifiants sont incorrects', () => {
    cy.intercept('POST', 'http://localhost:8000/login', {
      statusCode: 401,
      body: { detail: 'Identifiant ou mot de passe incorrect' },
    }).as('loginFail')

    cy.get('#identifiant').type('mauvais')
    cy.get('#mdp').type('mauvais')
    cy.contains('button', 'Se connecter').click()
    cy.wait('@loginFail')

    cy.contains('Identifiant ou mot de passe incorrect').should('be.visible')
  })
})

describe('Vue admin', () => {
  beforeEach(() => {
    cy.intercept('GET', 'http://localhost:8000/users', { fixture: 'users.json' })
    cy.visit('/')
    cy.loginAs('admin', 'admin', true)
  })

  it('affiche les colonnes identifiant et email', () => {
    cy.contains('th', 'Identifiant').should('be.visible')
    cy.contains('th', 'Email').should('be.visible')
  })

  it('affiche les boutons supprimer', () => {
    cy.contains('button', 'Supprimer').should('exist')
  })

  it('peut supprimer un utilisateur', () => {
    cy.intercept('DELETE', 'http://localhost:8000/users/*', {
      statusCode: 200,
      body: { message: 'User deleted' },
    }).as('deleteUser')

    cy.intercept('GET', 'http://localhost:8000/users', {
      body: [{ id: 2, nom: 'Fenoll', prenom: 'Loise', email: 'loise.fenoll@ynov.com', identifiant: 'loise.fenoll@ynov.com', is_admin: true }],
    })

    cy.contains('button', 'Supprimer').first().click()
    cy.wait('@deleteUser')
    cy.contains('Liste des utilisateurs (1)').should('be.visible')
  })

  it('déconnexion masque les colonnes admin', () => {
    cy.contains('button', 'Déconnexion').click()
    cy.contains('th', 'Identifiant').should('not.exist')
  })
})
