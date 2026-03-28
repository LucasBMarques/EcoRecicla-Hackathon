CREATE DATABASE ecorecicla;

USE ecorecicla;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(200),
    nickname VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    photo LONGBLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS collection_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    materials VARCHAR(255),
    user_id INT,
    phone VARCHAR(20),
    opening_hours VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS material_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(10),
    color VARCHAR(7)
);

INSERT INTO material_types (name, icon, color) VALUES
('Papel', '📄', '#8B7355'),
('Metal', '🔩', '#C0C0C0'),
('Lâmpadas', '💡', '#FFD700'),
('Entulho', '🏗️', '#A9A9A9'),
('Plástico', '♻️', '#4169E1'),
('Vidro', '🥃', '#87CEEB'),
('Eletrônicos', '📱', '#000000'),
('Madeira', '🪵', '#8B4513');