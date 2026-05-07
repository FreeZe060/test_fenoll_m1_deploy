/**
 * Calculates the age of a person based on their birth date.
 * @param {object} p - An object representing a person
 * @param {Date} p.birth - The person's birth date
 * @returns {number} The age of the person in years
 * @throws {Error} If p is missing — "missing param p"
 * @throws {Error} If p.birth is missing — "missing param p.birth"
 * @throws {Error} If p.birth is not a Date instance — "p.birth is not a Date"
 * @throws {Error} If p.birth is not a valid Date — "p.birth is not a valid Date"
 * @throws {Error} If p.birth is in the future — "birth date cannot be in the future"
 */
function calculateAge(p) {
    if (!p) throw new Error("missing param p")
    if (!p.birth) throw new Error("missing param p.birth")
    if (!(p.birth instanceof Date)) throw new Error("p.birth is not a Date")
    if (isNaN(p.birth)) throw new Error("p.birth is not a valid Date")
    if (p.birth > new Date()) throw new Error("birth date cannot be in the future")
    let dateDiff = new Date(Date.now() - p.birth.getTime())
    let age = Math.abs(dateDiff.getUTCFullYear() - 1970)
    return age;
}

/**
 * Validates a nom or prénom (letters, hyphens, apostrophes, accents only, min 2 chars).
 * @param {string} value
 * @returns {boolean}
 */
function isValidName(value) {
    return /^[a-zA-ZÀ-ÿ\s\-']{2,}$/.test(value.trim());
}

/**
 * Validates an email address.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Validates that the person is at least 18 years old.
 * Internally uses calculateAge — returns false if the date is invalid or in the future.
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {boolean}
 */
function isAdult(dateStr) {
    if (!dateStr) return false;
    try {
        return calculateAge({ birth: new Date(dateStr) }) >= 18;
    } catch {
        return false;
    }
}

/**
 * Validates a French postal code (exactly 5 digits).
 * @param {string} cp
 * @returns {boolean}
 */
function isValidCodePostal(cp) {
    return /^\d{5}$/.test(cp.trim());
}

/**
 * Validates all form fields and returns an object of error messages.
 * @param {object} formData
 * @param {string} formData.nom
 * @param {string} formData.prenom
 * @param {string} formData.mail
 * @param {string} formData.dateNaissance
 * @param {string} formData.ville
 * @param {string} formData.codePostal
 * @returns {object} errors - Empty object means no errors
 */
function validateForm(formData) {
    const errors = {};
    if (!isValidName(formData.nom)) errors.nom = 'Nom invalide (min. 2 lettres)';
    if (!isValidName(formData.prenom)) errors.prenom = 'Prénom invalide (min. 2 lettres)';
    if (!isValidEmail(formData.mail)) errors.mail = 'Email invalide';
    if (!isAdult(formData.dateNaissance)) errors.dateNaissance = 'Vous devez avoir au moins 18 ans';
    if (!formData.ville.trim()) errors.ville = 'Ville requise';
    if (!isValidCodePostal(formData.codePostal)) errors.codePostal = 'Code postal invalide (5 chiffres)';
    return errors;
}

export { calculateAge, isValidName, isValidEmail, isAdult, isValidCodePostal, validateForm };
