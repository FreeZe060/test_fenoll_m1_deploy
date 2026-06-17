import { useState } from "react";

const ADMIN_PASSWORD = "admin";

/**
 * Liste des utilisateurs avec mode admin.
 * @component
 * @param {Array} users - Liste des utilisateurs.
 * @param {Function} onDelete - Callback après suppression.
 * @returns {JSX.Element}
 */
function UserList({ users, onDelete }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminInput, setAdminInput] = useState("");
    const [showLogin, setShowLogin] = useState(false);

    const handleAdminLogin = () => {
        if (adminInput === ADMIN_PASSWORD) {
            setIsAdmin(true);
            setShowLogin(false);
            setAdminInput("");
        } else {
            alert("Mot de passe incorrect");
        }
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:8000/users/${id}`, { method: "DELETE" })
            .then(() => onDelete());
    };

    return (
        <div>
            <h2>Liste des utilisateurs ({users.length})</h2>

            {!isAdmin && (
                <button onClick={() => setShowLogin(!showLogin)}>
                    Mode Admin
                </button>
            )}

            {showLogin && !isAdmin && (
                <div>
                    <input
                        type="password"
                        placeholder="Mot de passe admin"
                        value={adminInput}
                        onChange={(e) => setAdminInput(e.target.value)}
                    />
                    <button onClick={handleAdminLogin}>Connexion</button>
                </div>
            )}

            {isAdmin && (
                <span>
                    Mode admin actif —{" "}
                    <button onClick={() => setIsAdmin(false)}>Déconnexion</button>
                </span>
            )}

            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        {isAdmin && <th>Identifiant</th>}
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.nom}</td>
                            <td>{user.prenom}</td>
                            {isAdmin && <td>{user.identifiant}</td>}
                            {isAdmin && (
                                <td>
                                    <button onClick={() => handleDelete(user.id)}>
                                        Supprimer
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
