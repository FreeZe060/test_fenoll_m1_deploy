import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Form from './Form';

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
        render(<Form />);
    });

    it('should render all fields and submit button', () => {
        expect(screen.getByLabelText('Nom')).toBeInTheDocument();
        expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
        expect(screen.getByLabelText('Mail')).toBeInTheDocument();
        expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
        expect(screen.getByLabelText('Ville')).toBeInTheDocument();
        expect(screen.getByLabelText('Code postal')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('should show errors on empty submit', () => {
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        expect(screen.getByTestId('error-nom')).toBeInTheDocument();
        expect(screen.getByTestId('error-prenom')).toBeInTheDocument();
        expect(screen.getByTestId('error-mail')).toBeInTheDocument();
        expect(screen.getByTestId('error-dateNaissance')).toBeInTheDocument();
        expect(screen.getByTestId('error-ville')).toBeInTheDocument();
        expect(screen.getByTestId('error-codePostal')).toBeInTheDocument();
    });

    it('should show error when under 18', () => {
        const under18 = new Date();
        under18.setFullYear(under18.getFullYear() - 10);
        fillForm({ ...validData, dateNaissance: under18.toISOString().split('T')[0] });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        expect(screen.getByTestId('error-dateNaissance')).toBeInTheDocument();
    });

    it('should show error for invalid postal code', () => {
        fillForm({ ...validData, codePostal: '1234' });
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        expect(screen.getByTestId('error-codePostal')).toBeInTheDocument();
    });

    it('should save to localStorage and show success on valid submit', () => {
        fillForm(validData);
        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
        expect(screen.getByTestId('success')).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem('user'))).toMatchObject(validData);
    });
});
