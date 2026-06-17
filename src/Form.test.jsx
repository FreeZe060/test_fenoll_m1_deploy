import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from './Form';

describe('Form', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({ json: () => Promise.resolve({ message: 'User created' }) })
        );
        render(<Form onSuccess={() => {}} />);
    });

    it('affiche tous les champs et le bouton', () => {
        expect(screen.getByLabelText('Nom')).toBeInTheDocument();
        expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
        expect(screen.getByLabelText('Identifiant')).toBeInTheDocument();
        expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "S'inscrire" })).toBeInTheDocument();
    });

    it('bouton désactivé si champs vides', () => {
        expect(screen.getByRole('button', { name: "S'inscrire" })).toBeDisabled();
    });

    it('bouton actif si tous les champs remplis', () => {
        fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont' } });
        fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean' } });
        fireEvent.change(screen.getByLabelText('Identifiant'), { target: { value: 'jdupont' } });
        fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'password123' } });
        expect(screen.getByRole('button', { name: "S'inscrire" })).not.toBeDisabled();
    });

    it('appelle fetch lors de la soumission', () => {
        fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont' } });
        fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean' } });
        fireEvent.change(screen.getByLabelText('Identifiant'), { target: { value: 'jdupont' } });
        fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: "S'inscrire" }));
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8000/users',
            expect.objectContaining({ method: 'POST' })
        );
    });
});
