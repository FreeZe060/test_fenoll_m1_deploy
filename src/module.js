/**
 * Calcule l'âge à partir d'une date de naissance.
 * @param {string} dateNaissance - Date au format YYYY-MM-DD
 * @returns {number} L'âge en années
 */
function calculateAge(dateNaissance) {
    const today = new Date();
    const birth = new Date(dateNaissance);
    let age = today.getFullYear() - birth.getFullYear();
    const mois = today.getMonth() - birth.getMonth();
    if (mois < 0 || (mois === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

/**
 * Valide un nom ou prénom (lettres, tirets, apostrophes, accents, min 2 caractères).
 * @param {string} value
 * @returns {boolean}
 */
function isValidName(value) {
    return /^[a-zA-ZÀ-ÿ\s\-']{2,}$/.test(value.trim());
}

/**
 * Valide un email.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Vérifie que la personne a au moins 18 ans.
 * @param {string} dateStr - Date au format YYYY-MM-DD
 * @returns {boolean}
 */
function isAdult(dateStr) {
    if (!dateStr) return false;
    return calculateAge(dateStr) >= 18;
}

/**
 * Valide un code postal français (5 chiffres).
 * @param {string} cp
 * @returns {boolean}
 */
function isValidCodePostal(cp) {
    return /^\d{5}$/.test(cp.trim());
}

/**
 * Valide les champs du formulaire et retourne les erreurs.
 * @param {object} formData
 * @returns {object}
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
