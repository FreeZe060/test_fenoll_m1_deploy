import { useState } from 'react';
import { validateForm } from './module';

/**
 * Registration form component.
 * Collects user information: nom, prénom, mail, date de naissance, ville, code postal.
 * Validates inputs and saves to localStorage on successful submit.
 * @component
 * @returns {JSX.Element}
 */
function Form() {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        mail: '',
        dateNaissance: '',
        ville: '',
        codePostal: '',
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            localStorage.setItem('user', JSON.stringify(formData));
            setSubmitted(true);
        }
    };

    if (submitted) {
        return <p>Inscription enregistrée !</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="nom">Nom</label>
                <input id="nom" name="nom" type="text" value={formData.nom} onChange={handleChange} />
                {errors.nom && <span>{errors.nom}</span>}
            </div>
            <div>
                <label htmlFor="prenom">Prénom</label>
                <input id="prenom" name="prenom" type="text" value={formData.prenom} onChange={handleChange} />
                {errors.prenom && <span>{errors.prenom}</span>}
            </div>
            <div>
                <label htmlFor="mail">Mail</label>
                <input id="mail" name="mail" type="email" value={formData.mail} onChange={handleChange} />
                {errors.mail && <span>{errors.mail}</span>}
            </div>
            <div>
                <label htmlFor="dateNaissance">Date de naissance</label>
                <input id="dateNaissance" name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} />
                {errors.dateNaissance && <span>{errors.dateNaissance}</span>}
            </div>
            <div>
                <label htmlFor="ville">Ville</label>
                <input id="ville" name="ville" type="text" value={formData.ville} onChange={handleChange} />
                {errors.ville && <span>{errors.ville}</span>}
            </div>
            <div>
                <label htmlFor="codePostal">Code postal</label>
                <input id="codePostal" name="codePostal" type="text" value={formData.codePostal} onChange={handleChange} />
                {errors.codePostal && <span>{errors.codePostal}</span>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default Form;
