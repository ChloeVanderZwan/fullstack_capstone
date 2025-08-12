CREATE TABLE Ballets (
       id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    composer VARCHAR(255),
    choreographer VARCHAR(255),
    year_premiered INTEGER,
    description TEXT,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    duration_minutes INTEGER,
    submitted_by INTEGER REFERENCES users(id)
);

INSERT INTO Ballets (title, composer, choreographer, year_premiered, description, difficulty_level, duration_minutes) VALUES
('Swan Lake', 'Pyotr Ilyich Tchaikovsky', 'Marius Petipa', 1877, 'A classical ballet about a princess turned into a swan by an evil sorcerer.', 'Advanced', 150),
('The Nutcracker', 'Pyotr Ilyich Tchaikovsky', 'Marius Petipa', 1892, 'A magical Christmas ballet about a girl and her nutcracker prince.', 'Intermediate', 90),
('Giselle', 'Adolphe Adam', 'Jean Coralli', 1841, 'A romantic ballet about a peasant girl who dies of a broken heart.', 'Advanced', 120);

CREATE TABLE Steps (
       id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    difficulty VARCHAR(20) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    submitted_by INTEGER REFERENCES users(id)
);

INSERT INTO Steps (name, description, difficulty) VALUES
('Plie', 'A bending of the knees while maintaining proper alignment', 'Beginner'),
('Tendu', 'A stretching of the foot along the floor', 'Beginner'),
('Demi-plie', 'A half bend of the knees', 'Beginner'),
('Grand plie', 'A full bend of the knees', 'Intermediate'),
('Battement', 'A beating movement of the leg', 'Intermediate'),
('Pirouette', 'A turn on one foot', 'Advanced');

CREATE TABLE Equipment (
       id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    submitted_by INTEGER REFERENCES users(id)
);

INSERT INTO Equipment (name, description, category) VALUES
('Pointe Shoes', 'Specialized ballet shoes for dancing on toes', 'Footwear'),
('Tutu', 'Classical ballet skirt', 'Atire'),
('Leotard', 'Fitted dance garment', 'Attire'),
('Ballet Barre', 'Horizontal bar for ballet exercises', 'Training Equipment'),
('Dance Floor', 'Sprung floor for ballet practice', 'Facility');

CREATE TABLE Ballet_Steps (
    id SERIAL PRIMARY KEY,
    ballet_id INTEGER REFERENCES Ballets(id) ON DELETE CASCADE,
    step_id INTEGER REFERENCES Steps(id) ON DELETE CASCADE,
    sequence_order INTEGER,
    UNIQUE(ballet_id, step_id)
);

CREATE TABLE Step_Equipment (
    id SERIAL PRIMARY KEY,
    step_id INTEGER REFERENCES Steps(id) ON DELETE CASCADE,
    equipment_id INTEGER REFERENCES Equipment(id) ON DELETE CASCADE,
    required BOOLEAN DEFAULT true,
    UNIQUE(step_id, equipment_id)
);

INSERT INTO Ballet_Steps (ballet_id, step_id, sequence_order) VALUES
((SELECT id FROM Ballets WHERE title = 'Swan Lake'), (SELECT id FROM Steps WHERE name = 'Plie'), 1),
((SELECT id FROM Ballets WHERE title = 'Swan Lake'), (SELECT id FROM Steps WHERE name = 'Pirouette'), 2),
((SELECT id FROM Ballets WHERE title = 'The Nutcracker'), (SELECT id FROM Steps WHERE name = 'Tendu'), 1),
((SELECT id FROM Ballets WHERE title = 'The Nutcracker'), (SELECT id FROM Steps WHERE name = 'Battement'), 2),
((SELECT id FROM Ballets WHERE title = 'Giselle'), (SELECT id FROM Steps WHERE name = 'Grand plie'), 1);

INSERT INTO Step_Equipment (step_id, equipment_id, required) VALUES
((SELECT id FROM Steps WHERE name = 'Plie'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
((SELECT id FROM Steps WHERE name = 'Plie'), (SELECT id FROM Equipment WHERE name = 'Ballet Barre'), false),
((SELECT id FROM Steps WHERE name = 'Tendu'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
((SELECT id FROM Steps WHERE name = 'Tendu'), (SELECT id FROM Equipment WHERE name = 'Ballet Barre'), false),
((SELECT id FROM Steps WHERE name = 'Demi-plie'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
((SELECT id FROM Steps WHERE name = 'Grand plie'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
((SELECT id FROM Steps WHERE name = 'Grand plie'), (SELECT id FROM Equipment WHERE name = 'Ballet Barre'), true),
((SELECT id FROM Steps WHERE name = 'Battement'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
((SELECT id FROM Steps WHERE name = 'Battement'), (SELECT id FROM Equipment WHERE name = 'Ballet Barre'), true),
((SELECT id FROM Steps WHERE name = 'Pirouette'), (SELECT id FROM Equipment WHERE name = 'Dance Floor'), true),
((SELECT id FROM Steps WHERE name = 'Pirouette'), (SELECT id FROM Equipment WHERE name = 'Pointe Shoes'), false);