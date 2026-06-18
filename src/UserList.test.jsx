import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import UserList from './UserList';

const mockUsers = [
    { id: 1, nom: 'Doe', prenom: 'John', identifiant: 'jdoe' },
    { id: 2, nom: 'Fenoll', prenom: 'Loise', identifiant: 'loise.fenoll' },
];

describe('UserList', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
    });

    it('affiche le nombre d utilisateurs', () => {
        render(<UserList users={mockUsers} isAdmin={false} onDelete={() => {}} />);
        expect(screen.getByText('Liste des utilisateurs (2)')).toBeInTheDocument();
    });

    it('affiche nom et prénom de chaque utilisateur', () => {
        render(<UserList users={mockUsers} isAdmin={false} onDelete={() => {}} />);
        expect(screen.getByText('Doe')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Fenoll')).toBeInTheDocument();
        expect(screen.getByText('Loise')).toBeInTheDocument();
    });

    it('ne montre pas identifiant ni supprimer si pas admin', () => {
        render(<UserList users={mockUsers} isAdmin={false} onDelete={() => {}} />);
        expect(screen.queryByText('Identifiant')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Supprimer' })).not.toBeInTheDocument();
    });

    it('montre identifiant et bouton supprimer si admin', () => {
        render(<UserList users={mockUsers} isAdmin={true} onDelete={() => {}} />);
        expect(screen.getByText('Identifiant')).toBeInTheDocument();
        expect(screen.getByText('jdoe')).toBeInTheDocument();
        expect(screen.getAllByRole('button', { name: 'Supprimer' })).toHaveLength(2);
    });

    it('appelle fetch DELETE et onDelete au clic supprimer', () => {
        const onDelete = jest.fn();
        render(<UserList users={mockUsers} isAdmin={true} onDelete={onDelete} />);
        fireEvent.click(screen.getAllByRole('button', { name: 'Supprimer' })[0]);
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8000/users/1',
            { method: 'DELETE' }
        );
    });
});
