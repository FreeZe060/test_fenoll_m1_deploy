import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

const mockUser = { id: 3, nom: 'Admin', prenom: 'System', identifiant: 'admin', is_admin: true };

async function renderApp() {
    await act(async () => { render(<App />); });
}

async function loginAs(user = { identifiant: 'admin', mdp: 'admin' }) {
    fireEvent.click(screen.getByRole('button', { name: /connexion/i }));
    fireEvent.change(screen.getByLabelText('Identifiant'), { target: { value: user.identifiant } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: user.mdp } });
    await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
    });
}

describe('App', () => {
    beforeEach(() => {
        global.fetch = jest.fn((url) => {
            if (url.includes('/login')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUser) });
            }
            return Promise.resolve({ json: () => Promise.resolve([]) });
        });
    });

    it('affiche le bouton connexion par défaut', async () => {
        await renderApp();
        expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
    });

    it('affiche la liste des utilisateurs sans être connecté', async () => {
        await renderApp();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('affiche le formulaire de connexion en popup au clic', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: /connexion/i }));
        expect(screen.getByLabelText('Identifiant')).toBeInTheDocument();
        expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    });

    it('ferme le popup via le bouton ✕', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: /connexion/i }));
        expect(screen.getByLabelText('Identifiant')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: '✕' }));
        expect(screen.queryByLabelText('Identifiant')).not.toBeInTheDocument();
    });

    it('ferme le popup en cliquant sur le fond de l overlay', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: /connexion/i }));
        const overlay = document.querySelector('.modal-overlay');
        fireEvent.click(overlay);
        expect(screen.queryByLabelText('Identifiant')).not.toBeInTheDocument();
    });

    it('ne ferme pas le popup en cliquant à l intérieur de la modale', async () => {
        await renderApp();
        fireEvent.click(screen.getByRole('button', { name: /connexion/i }));
        fireEvent.click(screen.getByRole('heading', { name: 'Connexion' }));
        expect(screen.getByLabelText('Identifiant')).toBeInTheDocument();
    });

    it('affiche le bouton déconnexion après connexion', async () => {
        await renderApp();
        await loginAs();
        expect(screen.getByRole('button', { name: /déconnexion/i })).toBeInTheDocument();
    });

    it('ferme le popup après connexion', async () => {
        await renderApp();
        await loginAs();
        expect(screen.queryByLabelText('Identifiant')).not.toBeInTheDocument();
    });

    it('déconnecte l utilisateur et réaffiche le bouton connexion', async () => {
        await renderApp();
        await loginAs();
        fireEvent.click(screen.getByRole('button', { name: /déconnexion/i }));
        expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
    });

    it('gère l erreur de chargement des utilisateurs', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
        await renderApp();
        expect(screen.getByRole('table')).toBeInTheDocument();
    });
});
