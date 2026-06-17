import { useState } from "react";

/**
 * Formulaire d'inscription utilisateur.
 * @component
 * @param {Function} onSuccess - Callback appelé après inscription réussie.
 * @returns {JSX.Element}
 */
function Form({ onSuccess }) {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [identifiant, setIdentifiant] = useState("");
    const [mdp, setMdp] = useState("");
    const [message, setMessage] = useState("");

    const isFormFilled = nom && prenom && identifiant && mdp;

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:8000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, prenom, identifiant, mdp }),
        })
            .then((res) => res.json())
            .then(() => {
                setMessage("Inscription réussie !");
                setNom("");
                setPrenom("");
                setIdentifiant("");
                setMdp("");
                onSuccess();
            })
            .catch(() => setMessage("Erreur lors de l'inscription."));
    };

    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nom">Nom</label>
                    <input
                        id="nom"
                        type="text"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="prenom">Prénom</label>
                    <input
                        id="prenom"
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="identifiant">Identifiant</label>
                    <input
                        id="identifiant"
                        type="text"
                        value={identifiant}
                        onChange={(e) => setIdentifiant(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="mdp">Mot de passe</label>
                    <input
                        id="mdp"
                        type="password"
                        value={mdp}
                        onChange={(e) => setMdp(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={!isFormFilled}>
                    {"S'inscrire"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Form;
