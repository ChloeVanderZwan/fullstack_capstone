-- Create users table first (referenced by other tables)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Ballets table
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

-- Create Steps table
CREATE TABLE Steps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    difficulty VARCHAR(20) CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    submitted_by INTEGER REFERENCES users(id)
);

-- Create Equipment table
CREATE TABLE Equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    submitted_by INTEGER REFERENCES users(id)
);

-- Create junction tables
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