import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from './Form';

const mockUser = { id: 3, nom: 'Admin', prenom: 'System', identifiant: 'admin', is_admin: true };

describe('Form', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockUser),
            })
        );
        render(<Form onLogin={() => {}} />);
    });

    it('affiche les champs identifiant et mot de passe', () => {
        expect(screen.getByLabelText('Identifiant')).toBeInTheDocument();
        expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
        expect(screen.queryByLabelText('Nom')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Prénom')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
    });

    it('bouton désactivé si champs vides', () => {
        expect(screen.getByRole('button', { name: 'Se connecter' })).toBeDisabled();
    });

    it('bouton actif si identifiant et mdp remplis', () => {
        fireEvent.change(screen.getByLabelText('Identifiant'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'admin' } });
        expect(screen.getByRole('button', { name: 'Se connecter' })).not.toBeDisabled();
    });

    it('appelle POST /login lors de la soumission', () => {
        fireEvent.change(screen.getByLabelText('Identifiant'), { target: { value: 'admin' } });
        fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'admin' } });
        fireEvent.click(screen.getByRole('button', { name: 'Se connecter' }));
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8000/login',
            expect.objectContaining({ method: 'POST' })
        );
    });
});
