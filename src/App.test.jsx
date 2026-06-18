import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

const mockUser = { id: 3, nom: 'Admin', prenom: 'System', identifiant: 'admin', is_admin: true };

describe('App', () => {
    beforeEach(() => {
        global.fetch = jest.fn((url) => {
            if (url.includes('/login')) {
                return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUser) });
            }
            return Promise.resolve({ json: () => Promise.resolve([]) });
        });
    });

    it('affiche le bouton connexion par défaut', () => {
        render(<App />);
        expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
    });

    it('affiche la liste des utilisateurs sans être connecté', () => {
        render(<App />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('affiche le formulaire de connexion en popup au clic', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /connexion/i }));
        expect(screen.getByLabelText('Identifiant')).toBeInTheDocument();
        expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    });

    it('affiche le bouton déconnexion après connexion', async () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /connexion/i }));
        fireEvent.change(screen.getByLabelText('Identifiant'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'admin' } });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
        });
        expect(screen.getByRole('button', { name: /déconnexion/i })).toBeInTheDocument();
    });

    it('ferme le popup après connexion', async () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /connexion/i }));
        fireEvent.change(screen.getByLabelText('Identifiant'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'admin' } });
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
        });
        expect(screen.queryByLabelText('Identifiant')).not.toBeInTheDocument();
    });
});
