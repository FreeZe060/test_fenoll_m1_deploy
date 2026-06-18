import { useState, useEffect } from "react";
import Form from "./Form";
import UserList from "./UserList";
import "./App.css";

/**
 * Composant principal de l'application.
 * @component
 * @returns {JSX.Element}
 */
function App() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);

    const isAdmin = !!currentUser?.is_admin;

    const handleLogin = (user) => {
        setCurrentUser(user);
        setShowLoginForm(false);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    const fetchUsers = () => {
        fetch("http://localhost:8000/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch(() => setUsers([]));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <nav>
                {!currentUser && (
                    <button onClick={() => setShowLoginForm(true)}>Connexion</button>
                )}
                {currentUser && (
                    <>
                        <span>Connecté : {currentUser.prenom} {currentUser.nom}</span>
                        <button onClick={handleLogout}>Déconnexion</button>
                    </>
                )}
            </nav>
            <UserList users={users} isAdmin={isAdmin} onDelete={fetchUsers} />
            {showLoginForm && (
                <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLoginForm(false)}>
                    <div className="modal-box">
                        <button className="modal-close" onClick={() => setShowLoginForm(false)}>✕</button>
                        <Form onLogin={handleLogin} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
