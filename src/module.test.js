import { calculateAge, isValidName, isValidEmail, isAdult, isValidCodePostal, validateForm } from './module';

test('calcul age correct', () => {
    const age = calculateAge('1991-07-11');
    const expected = new Date().getFullYear() - 1991;
    expect(age === expected || age === expected - 1).toBe(true);
});

test('age 18 pile', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    const dateStr = date.toISOString().split('T')[0];
    expect(calculateAge(dateStr)).toBe(18);
});

describe('isAdult', () => {
    test('majeur', () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 20);
        expect(isAdult(d.toISOString().split('T')[0])).toBe(true);
    });

    test('mineur', () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 15);
        expect(isAdult(d.toISOString().split('T')[0])).toBe(false);
    });

    test('chaine vide retourne false', () => {
        expect(isAdult('')).toBe(false);
    });
});

describe('isValidName', () => {
    it('noms valides', () => {
        expect(isValidName('Dupont')).toBe(true);
        expect(isValidName('Jean-Pierre')).toBe(true);
        expect(isValidName("O'Brien")).toBe(true);
        expect(isValidName('Héloïse')).toBe(true);
        expect(isValidName('Müller')).toBe(true);
    });

    it('noms invalides', () => {
        expect(isValidName('A')).toBe(false);
        expect(isValidName('123')).toBe(false);
        expect(isValidName('Jean2')).toBe(false);
        expect(isValidName('')).toBe(false);
        expect(isValidName('J@ck')).toBe(false);
    });
});

describe('isValidEmail', () => {
    it('emails valides', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name+tag@domain.fr')).toBe(true);
    });

    it('emails invalides', () => {
        expect(isValidEmail('pasunmail')).toBe(false);
        expect(isValidEmail('missing@domain')).toBe(false);
        expect(isValidEmail('')).toBe(false);
    });
});

describe('isValidCodePostal', () => {
    it('codes valides', () => {
        expect(isValidCodePostal('75001')).toBe(true);
        expect(isValidCodePostal('69100')).toBe(true);
    });

    it('codes invalides', () => {
        expect(isValidCodePostal('1234')).toBe(false);
        expect(isValidCodePostal('ABCDE')).toBe(false);
        expect(isValidCodePostal('123456')).toBe(false);
        expect(isValidCodePostal('')).toBe(false);
    });
});

describe('validateForm', () => {
    const validData = {
        nom: 'Dupont',
        prenom: 'Jean',
        mail: 'jean.dupont@example.com',
        dateNaissance: '1990-01-01',
        ville: 'Paris',
        codePostal: '75001',
    };

    it('pas d erreurs si tout est valide', () => {
        expect(validateForm(validData)).toEqual({});
    });

    it('erreurs sur tous les champs invalides', () => {
        const errors = validateForm({ nom: 'A', prenom: '1', mail: 'bad', dateNaissance: '', ville: '', codePostal: '123' });
        expect(errors.nom).toBeDefined();
        expect(errors.prenom).toBeDefined();
        expect(errors.mail).toBeDefined();
        expect(errors.dateNaissance).toBeDefined();
        expect(errors.ville).toBeDefined();
        expect(errors.codePostal).toBeDefined();
    });
});
