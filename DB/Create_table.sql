CREATE TABLE Base_model (  
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at DATE,
    updated_at DATE
);
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