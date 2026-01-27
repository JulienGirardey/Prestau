INSERT INTO company (
    id,
    email,
    password_hash,
    phone_number,
    role,
    is_active,
    company_name,
    address,
    siret,
    establishment_type,
    description,
    website_url,
    social_media,
    created_at,
    updated_at
)
VALUES
(
    DEFAULT,
    'chezpedro@gmail.com',
    '$2y$10$KbQi4q7X0ZpQF5G9QZx2fOQ6mZ5k0KZQYt9m3yQ2X0v5m8Qe1bW7S',
    '0606060606',
    'company',
    true,
    'Chez Pedro',
    'rue de la faim',
    '12345678900012',
    'restaurant',
    'A friendly, family-run Italian restaurant.',
    'https://www.chezpedro.fr',
    'facebook.com/chezpedro, instagram.com/chezpedro',
    CURRENT_DATE,
    CURRENT_DATE
),
(
    DEFAULT,
    'laguilde@gmail.com',
    '$2y$10$KbQi4q7X0ZpQF5G9QZx2fOQ6mZ5k0KZQYt9m3yQ2X0v5m8Qe1bW7S',
    '0707070707',
    'company',
    true,
    'La Guilde',
    'rue de la soif',
    '12345678900013',
    'bar',
    'Cocktail bar and live music.',
    'https://www.laguilde.fr',
    'facebook.com/laguilde, instagram.com/laguilde',
    CURRENT_DATE,
    CURRENT_DATE
);

INSERT INTO worker (
    id,
    first_name,
    last_name,
    email,
    password_hash,
    phone_number,
    role,
    is_active,
    date_of_birth,
    city,
    postal_code,
    photo_url,
    profession,
    experience_years,
    skills,
    languages,
    qualifications,
    cv_url,
    availability,
    latitude,
    longitude,
    created_at,
    updated_at
)
VALUES
(
    DEFAULT,
    'Aurelie',
    'Dimartino',
    'aurelie@gmail.com',
    '$2y$10$KbQi4q7X0ZpQF5G9QZx2fOQ6mZ5k0KZQYt9m3yQ2X0v5m8Qe1bW7S',
    '0606060606',
    'worker',
    true,
    '2002-12-12',
    'Gonfaron',
    '83590',
    NULL,
    'student',
    NULL,
    'dishwashing',
    'french, english',
    NULL,
    true,
    43.3205,
    6.3074,
    CURRENT_DATE,
    CURRENT_DATE
),
(
    DEFAULT,
    'Sam',
    'Lechat',
    'sam@gmail.com',
    '$2y$10$KbQi4q7X0ZpQF5G9QZx2fOQ6mZ5k0KZQYt9m3yQ2X0v5m8Qe1bW7S',
    '0707070707',
    'worker',
    true,
    '1995-09-20',
    'Fréjus',
    '83600',
    'https://example.com/photos/sam.jpg',
    'barista',
    3,
    'cocktail preparation, bar service',
    'french, english',
    'expérience bar/resto',
    'https://example.com/cv/sam_lechat.pdf',
    true,
    43.4321,
    6.7333,
    CURRENT_DATE,
    CURRENT_DATE
);

INSERT INTO job (
    id,
    title,
    description,
    salary,
    latitude,
    longitude,
    start_time,
    end_time,
    status,
    created_at,
    updated_at
)
VALUES
(
    DEFAULT,
    'Waiter / Waitress',
    'Taking orders, serving customers, collecting payments, and cleaning tables.',
    12.5,
    43.3205,
    6.3074,
    '2026-04-01 12:00:00',
    '2026-04-01 16:00:00',
    'open',
    CURRENT_DATE,
    CURRENT_DATE
),
(
    DEFAULT,
    'Bartender / Barmaid',
    'Cocktail preparation, bar service',
    13.5,
    43.4321,
    6.7333,
    '2026-03-01 20:00:00',
    '2026-03-01 23:00:00',
    'completed',
    CURRENT_DATE,
    CURRENT_DATE
);

INSERT INTO joboffer (
    id,
    status,
    request_at,
    responsed_at,
    selected_at,
    contract_url,
    contract_signed,
    signed_at,
    selected_by_company,
    created_at,
    updated_at
)
VALUES
(
    DEFAULT,
    'pending',
    '2026-04-01 16:00:00',
    NULL,
    NULL,
    NULL,
    false,
    NULL,
    false,
    CURRENT_DATE,
    CURRENT_DATE
),
(
    DEFAULT,
    'accepted',
    '2026-02-24 16:00:00',
    '2026-02-24 17:00:00',
    '2026-02-24 17:00:00',
    'https://example.com/contracts/sam_lechat.pdf',
    true,
    '2026-02-26 08:00:00',
    true,
    CURRENT_DATE,
    CURRENT_DATE
);

INSERT INTO review (
    id,
    rating,
    comment,
    is_visible,
    created_at,
    updated_at
)
VALUES
(
    DEFAULT,
    5,
    'Very good work, punctual and professional.',
    true,
    CURRENT_DATE,
    CURRENT_DATE
),
(
    DEFAULT,
    4,
    'Overall good experience, would recommend.',
    true,
    CURRENT_DATE,
    CURRENT_DATE
);


INSERT INTO message (
    id,
    content,
    sent_at,
    is_read,
    created_at,
    updated_at
)
VALUES
(
    DEFAULT,
    'Hello, I am interested in your server offer.',
    CURRENT_DATE,
    false,
    CURRENT_DATE,
    CURRENT_DATE
),
(
    DEFAULT,
    'Hello, thank you for your message. I am excited to join the bar shift.',
    CURRENT_DATE,
    false,
    CURRENT_DATE,
    CURRENT_DATE
);
