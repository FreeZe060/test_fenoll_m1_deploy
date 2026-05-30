import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateForm } from './module';

/**
 * Formulaire d'inscription utilisateur.
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

    const isFormFilled = Object.values(formData).every(v => v.trim() !== '');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            localStorage.setItem('user', JSON.stringify(formData));
            toast.success('Inscription enregistrée !');
            setFormData({ nom: '', prenom: '', mail: '', dateNaissance: '', ville: '', codePostal: '' });
            setErrors({});
        } else {
            toast.error('Veuillez corriger les erreurs du formulaire');
        }
    };

    return (
        <>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nom">Nom</label>
                    <input id="nom" name="nom" type="text" value={formData.nom} onChange={handleChange} />
                    {errors.nom && <span style={{ color: 'red' }}>{errors.nom}</span>}
                </div>
                <div>
                    <label htmlFor="prenom">Prénom</label>
                    <input id="prenom" name="prenom" type="text" value={formData.prenom} onChange={handleChange} />
                    {errors.prenom && <span style={{ color: 'red' }}>{errors.prenom}</span>}
                </div>
                <div>
                    <label htmlFor="mail">Mail</label>
                    <input id="mail" name="mail" type="text" value={formData.mail} onChange={handleChange} />
                    {errors.mail && <span style={{ color: 'red' }}>{errors.mail}</span>}
                </div>
                <div>
                    <label htmlFor="dateNaissance">Date de naissance</label>
                    <input id="dateNaissance" name="dateNaissance" type="date" value={formData.dateNaissance} onChange={handleChange} />
                    {errors.dateNaissance && <span style={{ color: 'red' }}>{errors.dateNaissance}</span>}
                </div>
                <div>
                    <label htmlFor="ville">Ville</label>
                    <input id="ville" name="ville" type="text" value={formData.ville} onChange={handleChange} />
                    {errors.ville && <span style={{ color: 'red' }}>{errors.ville}</span>}
                </div>
                <div>
                    <label htmlFor="codePostal">Code postal</label>
                    <input id="codePostal" name="codePostal" type="text" value={formData.codePostal} onChange={handleChange} />
                    {errors.codePostal && <span style={{ color: 'red' }}>{errors.codePostal}</span>}
                </div>
                <button type="submit" disabled={!isFormFilled}>Enregistrer</button>
            </form>
        </>
    );
}

export default Form;
