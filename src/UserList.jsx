import axios from "axios";
import { API_URL } from "./config";
/**
 * Liste des utilisateurs.
 * @component
 * @param {Array} users - Liste des utilisateurs.
 * @param {boolean} isAdmin - Indique si l'utilisateur connecté est admin.
 * @param {Function} onDelete - Callback après suppression.
 * @returns {JSX.Element}
 */
function UserList({ users, isAdmin, onDelete }) {
    const handleDelete = (id) => {
        axios.delete(`${API_URL}/users/${id}`)
            .then(() => onDelete());
    };

    return (
        <div>
            <h2>Liste des utilisateurs ({users.length})</h2>

            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        {isAdmin && <th>Identifiant</th>}
                        {isAdmin && <th>Email</th>}
                        {isAdmin && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.nom}</td>
                            <td>{user.prenom}</td>
                            {isAdmin && <td>{user.identifiant}</td>}
                            {isAdmin && <td>{user.email ?? "—"}</td>}
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
