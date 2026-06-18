Cypress.Commands.add('loginAs', (identifiant, mdp, isAdmin = false) => {
    cy.intercept('POST', 'http://localhost:8000/login', {
        statusCode: 200,
        body: {
            id: 99,
            nom: 'Test',
            prenom: 'User',
            identifiant,
            is_admin: isAdmin,
        },
    }).as('loginRequest');

    cy.contains('button', 'Connexion').click();
    cy.get('#identifiant').type(identifiant);
    cy.get('#mdp').type(mdp);
    cy.contains('button', 'Se connecter').click();
    cy.wait('@loginRequest');
});
