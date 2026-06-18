import { useState } from "react";
import axios from "axios";
import "./Form.css";
import { API_URL } from "./config";

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
        axios.post(`${API_URL}/login`, { identifiant, mdp })
            .then((res) => {
                setIdentifiant("");
                setMdp("");
                onLogin(res.data);
            })
            .catch(() => setError("Identifiant ou mot de passe incorrect"));
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
