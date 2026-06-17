import { useState, useEffect } from "react";
import Form from "./Form";
import UserList from "./UserList";

/**
 * Composant principal de l'application.
 * @component
 * @returns {JSX.Element}
 */
function App() {
    const [view, setView] = useState("form");
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);

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
                <button onClick={() => setView("form")}>Connexion</button>
                <button onClick={() => setView("list")}>
                    Utilisateurs ({users.length})
                </button>
            </nav>
            <p>{users.length} user(s) already registered</p>
            {view === "form" && <Form onSuccess={fetchUsers} />}
            {view === "list" && <UserList users={users} isAdmin={isAdmin} onDelete={fetchUsers} />}
        </div>
    );
}

export default App;
