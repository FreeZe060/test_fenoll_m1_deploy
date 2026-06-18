USE ynov_ci;

ALTER TABLE utilisateur
  ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;

INSERT INTO utilisateur (nom, prenom, identifiant, mdp, is_admin) VALUES
    ('Admin', 'System', 'admin', 'admin', TRUE);

INSERT INTO utilisateur (nom, prenom, email, identifiant, mdp, is_admin) VALUES
    ('Fenoll', 'Loise', 'loise.fenoll@ynov.com', 'loise.fenoll@ynov.com', 'PvdrTAzTeR247sDnAZBr', TRUE);
