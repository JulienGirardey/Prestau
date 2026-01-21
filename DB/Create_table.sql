CREATE TABLE Base_model (  
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at DATE,
    updated_at DATE
);
COMMENT ON TABLE Base_model IS 'Table de base pour les autres modèles avec des champs communs.';
COMMENT ON COLUMN Base_model.id IS 'Identifiant unique';
CREATE TABLE Company (
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    company_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    siret VARCHAR(14) UNIQUE,
    establishment_type VARCHAR(100),
    description TEXT,
    website_url VARCHAR(255),
    social_media JSON,
    created_at DATE,
    updated_at DATE
) INHERITS (Base_model);
COMMENT ON TABLE Company IS 'Représente une entreprise utilisant la plateforme.';
COMMENT ON COLUMN Company.company_name IS 'Nom de l\'entreprise';
COMMENT ON COLUMN Company.address IS 'Adresse de l\'entreprise';
COMMENT ON COLUMN Company.siret IS 'Numéro SIRET unique de l\'entreprise';
COMMENT ON COLUMN Company.establishment_type IS 'Type d\'établissement (ex: SARL, SAS, etc.)';
COMMENT ON COLUMN Company.description IS 'Description de l\'entreprise';
COMMENT ON COLUMN Company.website_url IS 'URL du site web de l\'entreprise';
COMMENT ON COLUMN Company.social_media IS 'Informations sur les réseaux sociaux au format JSON';
CREATE TABLE Users (
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATE,
    updated_at DATE
) INHERITS (Base_model);
COMMENT ON TABLE User IS 'Représente un utilisateur de la plateforme, qu\'il soit travailleur ou entreprise.';
COMMENT ON COLUMN User.first_name IS 'Prénom de l\'utilisateur';
COMMENT ON COLUMN User.last_name IS 'Nom de famille de l\'utilisateur';
COMMENT ON COLUMN User.email IS 'Adresse e-mail unique de l\'utilisateur';
COMMENT ON COLUMN User.password_hash IS 'Hash du mot de passe de l\'utilisateur';
COMMENT ON COLUMN User.phone_number IS 'Numéro de téléphone de l\'utilisateur';
COMMENT ON COLUMN User.role IS 'Rôle de l\'utilisateur (ex: worler, company)';
COMMENT ON COLUMN User.is_active IS 'Indique si le compte utilisateur est actif';
CREATE TABLE Worler (
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    date_of_birth DATE,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    photo_url VARCHAR(255),
    profession VARCHAR(100),
    experience_years INT,
    skills VARCHAR(255),
    languages VARCHAR(255),
    qualifications TEXT,
    cv_url VARCHAR(255),
    availability BOOLEAN,
    latitude FLOAT,
    longitude FLOAT,
    created_at DATE,
    updated_at DATE
) INHERITS (Base_model);
COMMENT ON TABLE Worler IS 'Représente un travailleur utilisant la plateforme.';
COMMENT ON COLUMN Worler.date_of_birth IS 'Date de naissance du travailleur';
COMMENT ON COLUMN Worler.city IS 'Ville de résidence du travailleur';
COMMENT ON COLUMN Worler.postal_code IS 'Code postal du travailleur';
COMMENT ON COLUMN Worler.photo_url IS 'URL de la photo du travailleur';
COMMENT ON COLUMN Worler.profession IS 'Profession du travailleur';
COMMENT ON COLUMN Worler.experience_years IS 'Nombre d\'années d\'expérience du travailleur';
COMMENT ON COLUMN Worler.skills IS 'Compétences du travailleur';
COMMENT ON COLUMN Worler.languages IS 'Langues parlées par le travailleur';
COMMENT ON COLUMN Worler.qualifications IS 'Qualifications du travailleur';
COMMENT ON COLUMN Worler.cv_url IS 'URL du CV du travailleur';
COMMENT ON COLUMN Worler.availability IS 'Disponibilité du travailleur pour de nouvelles missions';
COMMENT ON COLUMN Worler.latitude IS 'Latitude de la localisation du travailleur';
COMMENT ON COLUMN Worler.longitude IS 'Longitude de la localisation du travailleur';
CREATE TABLE Job (
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    salary FLOAT,
    latitude FLOAT,
    longitude FLOAT,
    start_time DATE,
    end_time DATE,
    status VARCHAR(50),
    created_at DATE,
    updated_at DATE
) INHERITS (Base_model);
COMMENT ON TABLE Job IS 'Représente une offre d\'emploi publiée par une entreprise.';
COMMENT ON COLUMN Job.title IS 'Titre de l\'offre d\'emploi';
COMMENT ON COLUMN Job.description IS 'Description de l\'offre d\'emploi';
COMMENT ON COLUMN Job.salary IS 'Salaire proposé pour l\'offre d\'emploi';
COMMENT ON COLUMN Job.latitude IS 'Latitude de l\'emplacement du poste';
COMMENT ON COLUMN Job.longitude IS 'Longitude de l\'emplacement du poste';
COMMENT ON COLUMN Job.start_time IS 'Date de début du poste';
COMMENT ON COLUMN Job.end_time IS 'Date de fin du poste';
COMMENT ON COLUMN Job.status IS 'Statut de l\'offre d\'emploi (ex: ouvert, fermé, en cours)';
CREATE TABLE JobOffer (
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    status VARCHAR(50),
    request_at DATE,
    responsed_at DATE,
    selected_at DATE,
    contract_url VARCHAR(255),
    contract_signed BOOLEAN,
    signed_at DATE,
    selected_by_company BOOLEAN,
    created_at DATE,
    updated_at DATE
) INHERITS (Base_model);
COMMENT ON TABLE JobOffer IS 'Représente une offre d\'emploi faite à un travailleur pour un poste spécifique.';
COMMENT ON COLUMN JobOffer.status IS 'Statut de l\'offre d\'emploi (ex: en attente, acceptée, refusée)';
COMMENT ON COLUMN JobOffer.request_at IS 'Date de la demande d\'offre d\'emploi';
COMMENT ON COLUMN JobOffer.responsed_at IS 'Date de la réponse à l\'offre d\'emploi';
COMMENT ON COLUMN JobOffer.selected_at IS 'Date de sélection du travailleur pour le poste';
COMMENT ON COLUMN JobOffer.contract_url IS 'URL du contrat d\'emploi';
COMMENT ON COLUMN JobOffer.contract_signed IS 'Indique si le contrat a été signé';
COMMENT ON COLUMN JobOffer.signed_at IS 'Date de signature du contrat';
COMMENT ON COLUMN JobOffer.selected_by_company IS 'Indique si le travailleur a été sélectionné par l\'entreprise';
CREATE TABLE Review (
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    job_id INT REFERENCES Job(id),
    reviewer_id INT REFERENCES Users(id),
    reviewee_id INT REFERENCES Users(id),
    is_visible BOOLEAN DEFAULT TRUE,
    created_at DATE,
    updated_at DATE
) INHERITS (Base_model);
COMMENT ON TABLE Review IS 'Représente une évaluation laissée par un utilisateur à un autre utilisateur après une mission.';
COMMENT ON COLUMN Review.rating IS 'Note de l\'évaluation (1 à 5)';
COMMENT ON COLUMN Review.comment IS 'Commentaire de l\'évaluation';
COMMENT ON COLUMN Review.job_id IS 'Identifiant de l\'emploi associé à l\'évaluation';
COMMENT ON COLUMN Review.reviewer_id IS 'Identifiant de l\'utilisateur qui laisse l\'évaluation';
COMMENT ON COLUMN Review.reviewee_id IS 'Identifiant de l\'utilisateur qui reçoit l\'évaluation';
COMMENT ON COLUMN Review.is_visible IS 'Indique si l\'évaluation est visible publiquement';
CREATE TABLE Message (
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    JobOffer_id INT REFERENCES JobOffer(id),
    content TEXT,
    sender_id INT REFERENCES Users(id),
    receiver_id INT REFERENCES Users(id),
    sent_at DATE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATE,
    updated_at DATE
) INHERITS (Base_model);
COMMENT ON TABLE Message IS 'Représente un message échangé entre utilisateurs concernant une offre d\'emploi.';
COMMENT ON COLUMN Message.JobOffer_id IS 'Identifiant de l\'offre d\'emploi associée au message';
COMMENT ON COLUMN Message.content IS 'Contenu du message';
COMMENT ON COLUMN Message.sender_id IS 'Identifiant de l\'utilisateur qui envoie le message';
COMMENT ON COLUMN Message.receiver_id IS 'Identifiant de l\'utilisateur qui reçoit le message';
COMMENT ON COLUMN Message.sent_at IS 'Date d\'envoi du message';
COMMENT ON COLUMN Message.is_read IS 'Indique si le message a été lu par le destinataire';
