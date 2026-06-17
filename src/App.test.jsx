import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ json: () => Promise.resolve([]) })
        );
    });

    it('affiche les boutons de navigation', () => {
        render(<App />);
        expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /utilisateurs/i })).toBeInTheDocument();
    });

    it('affiche le formulaire par défaut', () => {
        render(<App />);
        expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    });

    it('bascule vers la liste en cliquant Utilisateurs', () => {
        render(<App />);
        fireEvent.click(screen.getByRole('button', { name: /utilisateurs/i }));
        expect(screen.getByText(/liste des utilisateurs/i)).toBeInTheDocument();
    });
});
