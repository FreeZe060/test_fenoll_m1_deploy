import { useState } from "react";
import "./Form.css";

/**
 * Formulaire de connexion utilisateur.
 * @component
 * @param {Function} onLogin - Callback appelé avec l'utilisateur connecté.
 * @returns {JSX.Element}
 */
function Form({ onLogin }) {
    const [identifiant, setIdentifiant] = useState("");
    const [mdp, setMdp] = useState("");
    const [error, setError] = useState("");

    const isFormFilled = identifiant && mdp;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifiant, mdp }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Identifiant ou mot de passe incorrect");
                return res.json();
            })
            .then((user) => {
                setIdentifiant("");
                setMdp("");
                onLogin(user);
            })
            .catch((err) => setError(err.message));
    };

    return (
        <div className="login-form">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="identifiant">Identifiant</label>
                    <input
                        id="identifiant"
                        type="text"
                        value={identifiant}
                        onChange={(e) => setIdentifiant(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="mdp">Mot de passe</label>
                    <input
                        id="mdp"
                        type="password"
                        value={mdp}
                        onChange={(e) => setMdp(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn-login" disabled={!isFormFilled}>
                    Se connecter
                </button>
            </form>
            {error && <p className="form-error">{error}</p>}
        </div>
    );
}

export default Form;
