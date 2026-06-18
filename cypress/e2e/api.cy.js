describe('API - GET /users', () => {
    it('retourne un tableau d utilisateurs - cas succès', () => {
        cy.request('http://localhost:8000/users').then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
        });
    });

    it('chaque utilisateur a un nom et un prénom', () => {
        cy.request('http://localhost:8000/users').then((response) => {
            response.body.forEach((user) => {
                expect(user).to.have.property('nom');
                expect(user).to.have.property('prenom');
            });
        });
    });
});

describe('API - POST /login', () => {
    it('retourne l utilisateur avec identifiants valides - cas succès', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8000/login',
            body: { identifiant: 'admin', mdp: 'admin' },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('identifiant', 'admin');
            expect(response.body).to.have.property('is_admin', true);
        });
    });

    it('retourne 401 avec identifiants invalides - cas erreur', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8000/login',
            body: { identifiant: 'wrong', mdp: 'wrong' },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property('detail');
        });
    });
});

describe('API - DELETE /users/:id', () => {
    it('retourne 200 après suppression - cas succès', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8000/login',
            body: { identifiant: 'admin', mdp: 'admin' },
        }).then((loginRes) => {
            const userId = loginRes.body.id;
            cy.request({
                method: 'POST',
                url: 'http://localhost:8000/users',
                body: { nom: 'Temp', prenom: 'User', identifiant: 'temp_e2e', mdp: 'tmp' },
            }).then((createRes) => {
                cy.request(`http://localhost:8000/users`).then((usersRes) => {
                    const tempUser = usersRes.body.find((u) => u.identifiant === 'temp_e2e');
                    cy.request({
                        method: 'DELETE',
                        url: `http://localhost:8000/users/${tempUser.id}`,
                    }).then((deleteRes) => {
                        expect(deleteRes.status).to.eq(200);
                    });
                });
            });
        });
    });
});
