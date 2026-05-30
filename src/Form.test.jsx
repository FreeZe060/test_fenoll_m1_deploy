import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { toast } from 'react-toastify';
import Form from './Form';

jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
    ToastContainer: () => null,
}));

const validData = {
    nom: 'Dupont',
    prenom: 'Jean',
    mail: 'jean.dupont@example.com',
    dateNaissance: '1990-01-01',
    ville: 'Paris',
    codePostal: '75001',
};

const fillForm = (data) => {
    fireEvent.change(screen.getByLabelText('Nom'), { target: { name: 'nom', value: data.nom } });
    fireEvent.change(screen.getByLabelText('Prénom'), { target: { name: 'prenom', value: data.prenom } });
    fireEvent.change(screen.getByLabelText('Mail'), { target: { name: 'mail', value: data.mail } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { name: 'dateNaissance', value: data.dateNaissance } });
    fireEvent.change(screen.getByLabelText('Ville'), { target: { name: 'ville', value: data.ville } });
    fireEvent.change(screen.getByLabelText('Code postal'), { target: { name: 'codePostal', value: data.codePostal } });
};

describe('Form', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        render(<Form />);
    });

    it('affiche tous les champs et le bouton', () => {
        expect(screen.getByLabelText('Nom')).toBeInTheDocument();
        expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
        expect(screen.getByLabelText('Mail')).toBeInTheDocument();
        expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
        expect(screen.getByLabelText('Ville')).toBeInTheDocument();
        expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeInTheDocument();
    });

    it('bouton desactive si champs vides', () => {
        expect(screen.getByRole('button', { name: 'Enregistrer' })).toBeDisabled();
    });

    it('bouton actif si tous les champs remplis', () => {
        fillForm(validData);
        expect(screen.getByRole('button', { name: 'Enregistrer' })).not.toBeDisabled();
    });

    it('toaster erreur et messages en rouge si champs invalides', () => {
        fillForm({ nom: 'AA', prenom: '1', mail: 'bad', dateNaissance: '2020-01-01', ville: 'x', codePostal: '123' });
        fireEvent.submit(screen.getByLabelText('Nom').closest('form'));
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByText('Prénom invalide (min. 2 lettres)')).toBeInTheDocument();
        expect(screen.getByText('Email invalide')).toBeInTheDocument();
        expect(screen.getByText('Vous devez avoir au moins 18 ans')).toBeInTheDocument();
        expect(screen.getByText('Code postal invalide (5 chiffres)')).toBeInTheDocument();
    });

    it('erreur nom si invalide', () => {
        fillForm({ ...validData, nom: 'A' });
        fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
        expect(toast.error).toHaveBeenCalled();
        expect(screen.getByText('Nom invalide (min. 2 lettres)')).toBeInTheDocument();
    });

    it('erreur si mineur', () => {
        const under18 = new Date();
        under18.setFullYear(under18.getFullYear() - 10);
        fillForm({ ...validData, dateNaissance: under18.toISOString().split('T')[0] });
        fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
        expect(screen.getByText('Vous devez avoir au moins 18 ans')).toBeInTheDocument();
    });

    it('erreur si code postal invalide', () => {
        fillForm({ ...validData, codePostal: '1234' });
        fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
        expect(screen.getByText('Code postal invalide (5 chiffres)')).toBeInTheDocument();
    });

    it('erreur ville si ville vide', () => {
        fillForm({ ...validData, ville: '' });
        fireEvent.submit(screen.getByLabelText('Nom').closest('form'));
        expect(screen.getByText('Ville requise')).toBeInTheDocument();
    });

    it('succes: localStorage sauvegarde, toaster, champs vides', () => {
        fillForm(validData);
        fireEvent.click(screen.getByRole('button', { name: 'Enregistrer' }));
        expect(toast.success).toHaveBeenCalledWith('Inscription enregistrée !');
        expect(JSON.parse(localStorage.getItem('user'))).toMatchObject(validData);
        expect(screen.getByLabelText('Nom')).toHaveValue('');
    });
});
