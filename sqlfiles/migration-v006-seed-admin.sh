#!/bin/bash
set -e

mysql -u root -p"${MYSQL_ROOT_PASSWORD}" "${MYSQL_DATABASE}" <<EOF
INSERT INTO utilisateur (nom, prenom, email, identifiant, mdp, is_admin)
VALUES ('Fenoll', 'Loise', '${ADMIN_EMAIL}', '${ADMIN_EMAIL}', '${ADMIN_PASSWORD}', TRUE);
EOF
