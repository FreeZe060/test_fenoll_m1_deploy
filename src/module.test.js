import { calculateAge, isValidName, isValidEmail, isAdult, isValidCodePostal, validateForm } from './module';

describe('calculateAge Unit Test Suites', () => {
    it('should return a correct age', () => {
        const loise = { birth: new Date("11/07/1991") };
        const expected = Math.abs(new Date(Date.now() - loise.birth.getTime()).getUTCFullYear() - 1970);
        expect(calculateAge(loise)).toEqual(expected);
    });

    it('should throw a "missing param p" error', () => {
        expect(() => calculateAge()).toThrow("missing param p");
    });

    it('should throw a "missing param p.birth" error', () => {
        expect(() => calculateAge({})).toThrow("missing param p.birth");
    });

    it('should throw a "p.birth is not a Date" error', () => {
        expect(() => calculateAge({ birth: "11/07/1991" })).toThrow("p.birth is not a Date");
    });

    it('should throw a "p.birth is not a valid Date" error', () => {
        expect(() => calculateAge({ birth: new Date("invalid-date") })).toThrow("p.birth is not a valid Date");
    });

    it('should throw a "birth date cannot be in the future" error', () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        expect(() => calculateAge({ birth: futureDate })).toThrow("birth date cannot be in the future");
    });
});

describe('isValidName', () => {
    it('should return true for valid names', () => {
        expect(isValidName('Dupont')).toBe(true);
        expect(isValidName('Jean-Pierre')).toBe(true);
        expect(isValidName("O'Brien")).toBe(true);
        expect(isValidName('Héloïse')).toBe(true);
    });

    it('should return false for invalid names', () => {
        expect(isValidName('A')).toBe(false);
        expect(isValidName('123')).toBe(false);
        expect(isValidName('')).toBe(false);
    });
});

describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name+tag@domain.fr')).toBe(true);
    });

    it('should return false for invalid emails', () => {
        expect(isValidEmail('not-an-email')).toBe(false);
        expect(isValidEmail('missing@domain')).toBe(false);
        expect(isValidEmail('')).toBe(false);
    });
});

describe('isAdult', () => {
    it('should return true for someone over 18', () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 20);
        expect(isAdult(date.toISOString().split('T')[0])).toBe(true);
    });

    it('should return false for someone under 18', () => {
        const date = new Date();
        date.setFullYear(date.getFullYear() - 10);
        expect(isAdult(date.toISOString().split('T')[0])).toBe(false);
    });

    it('should return false for empty or invalid date', () => {
        expect(isAdult('')).toBe(false);
        expect(isAdult('invalid')).toBe(false);
    });
});

describe('isValidCodePostal', () => {
    it('should return true for valid French postal codes', () => {
        expect(isValidCodePostal('75001')).toBe(true);
        expect(isValidCodePostal('69100')).toBe(true);
    });

    it('should return false for invalid postal codes', () => {
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

    it('should return no errors for valid data', () => {
        expect(validateForm(validData)).toEqual({});
    });

    it('should return errors for all invalid fields', () => {
        const errors = validateForm({ nom: 'A', prenom: '1', mail: 'bad', dateNaissance: '', ville: '', codePostal: '123' });
        expect(errors.nom).toBeDefined();
        expect(errors.prenom).toBeDefined();
        expect(errors.mail).toBeDefined();
        expect(errors.dateNaissance).toBeDefined();
        expect(errors.ville).toBeDefined();
        expect(errors.codePostal).toBeDefined();
    });
});
