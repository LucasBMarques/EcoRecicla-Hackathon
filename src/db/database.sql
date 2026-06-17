CREATE DATABASE IF NOT EXISTS ecorecicla;

USE ecorecicla;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(200),
    nickname VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    photo LONGBLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eco_points INT NOT NULL DEFAULT 0,
    level ENUM('Semente','Broto','Árvore','Floresta','Guardião') NOT NULL DEFAULT 'Semente',
    total_kg DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    co2_avoided DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    water_saved DECIMAL(10,3) NOT NULL DEFAULT 0.000
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

-- NOVAS TABELAS PARA O SISTEMA DE RECICLAGEM
CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    icon VARCHAR(10) NOT NULL DEFAULT '♻️',
    co2_factor DECIMAL(8,4) NOT NULL DEFAULT 0.0000,
    water_factor DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    points_per_kg INT NOT NULL DEFAULT 10,
    units_accepted JSON DEFAULT NULL,
    description TEXT DEFAULT NULL,
    preparation_tip TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    condition_type ENUM('total_kg','total_points','streak_days','material_type','logs_count') NOT NULL,
    condition_value DECIMAL(10,3) NOT NULL,
    condition_material_id INT DEFAULT NULL,
    FOREIGN KEY (condition_material_id) REFERENCES materials(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_badge (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recycling_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    material_id INT NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit ENUM('kg','g','unidade','garrafa','lata','caixa') NOT NULL DEFAULT 'kg',
    quantity_kg DECIMAL(10,3) NOT NULL,
    co2_avoided DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    water_saved DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    points_earned INT NOT NULL DEFAULT 0,
    photo_url VARCHAR(512) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    collection_point_id INT DEFAULT NULL,
    logged_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE RESTRICT,
    FOREIGN KEY (collection_point_id) REFERENCES collection_points(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS collection_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    collection_point_id INT DEFAULT NULL,
    material_id INT DEFAULT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME DEFAULT NULL,
    status ENUM('pendente','confirmado','concluido','cancelado') NOT NULL DEFAULT 'pendente',
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (collection_point_id) REFERENCES collection_points(id) ON DELETE SET NULL,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL
);

-- INSERIR DADOS INICIAIS
INSERT IGNORE INTO materials (name, icon, co2_factor, water_factor, points_per_kg, units_accepted, description, preparation_tip) VALUES
('Papel', '📄', 1.0500, 26.0000, 12, '["kg","g","caixa"]', 'Jornais, revistas, papelão.', 'Mantenha seco e sem gordura.'),
('Plástico', '♻️', 1.5300, 17.0000, 18, '["kg","g","unidade"]', 'PET, PEAD, PVC.', 'Enxágue e remova tampas.'),
('Vidro', '🥃', 0.3100, 4.0000, 8, '["kg","g","garrafa","unidade"]', 'Garrafas, potes, frascos.', 'Enxágue e remova tampas metálicas.'),
('Metal', '🔩', 1.8000, 40.0000, 35, '["kg","g","lata","unidade"]', 'Alumínio, aço, latas.', 'Esmague as latas para reduzir volume.'),
('Eletrônicos', '📱', 2.5000, 30.0000, 40, '["kg","unidade"]', 'Celulares, computadores.', 'Retire pilhas antes de descartar.'),
('Óleo Vegetal', '🫙', 3.2000, 1000.0000, 30, '["kg","g"]', 'Óleo de cozinha usado.', 'Armazene em garrafa PET tampada.'),
('Lâmpadas', '💡', 0.8000, 5.0000, 15, '["unidade","kg"]', 'Fluorescentes, LED.', 'Embale com cuidado para não quebrar.'),
('Madeira', '🪵', 0.5000, 10.0000, 6, '["kg","g"]', 'Paletes, móveis.', 'Remova pregos e parafusos.'),
('Têxtil', '👕', 0.9200, 10.0000, 20, '["kg","g","unidade"]', 'Roupas, calçados, tecidos.', 'Higienize antes de entregar.'),
('Pilhas/Baterias', '🔋', 1.8000, 20.0000, 25, '["unidade","kg"]', 'Pilhas AA, AAA, baterias.', 'Guarde em saco plástico separado.'),
('Entulho', '🏗️', 0.2000, 2.0000, 5, '["kg","g"]', 'Resíduos de construção, concreto e tijolos.', 'Separe por tipo para facilitar a reciclagem.'),
('Aluminio', '🥫', 9.0000, 170.0000, 40, '["kg","g","lata","unidade"]', 'Latas e peças de alumínio.', 'Esmague para reduzir volume.');

INSERT IGNORE INTO badges (name, description, icon, condition_type, condition_value) VALUES
('Primeiro Passo', 'Seu primeiro registro.', '🌱', 'logs_count', 1),
('10 kg Reciclados', 'Você reciclou 10 kg.', '🎯', 'total_kg', 10),
('50 kg Reciclados', '50 kg de material reciclado.', '🏆', 'total_kg', 50),
('Econômico', '500 eco-pontos acumulados.', '💎', 'total_points', 500),
('Mestre Verde', '200 kg reciclados.', '🌳', 'total_kg', 200),
('Ecologista', '50 registros realizados.', '🌍', 'logs_count', 50);

-- INSERIR DADOS NA TABELA material_types (se não existir)
INSERT IGNORE INTO material_types (name, icon, color) VALUES
('Papel', '📄', '#8B7355'),
('Metal', '🔩', '#C0C0C0'),
('Lâmpadas', '💡', '#FFD700'),
('Entulho', '🏗️', '#A9A9A9'),
('Plástico', '♻️', '#4169E1'),
('Vidro', '🥃', '#87CEEB'),
('Eletrônicos', '📱', '#000000'),
('Madeira', '🪵', '#8B4513'),
('Óleo Vegetal', '🫙', '#6B8E23'),
('Têxtil', '👕', '#DB7093'),
('Pilhas/Baterias', '🔋', '#4B0082'),
('Aluminio', '🥫', '#B0C4DE');