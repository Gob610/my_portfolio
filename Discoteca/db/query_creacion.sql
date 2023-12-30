	-- Crear la base de datos 'Reservas'
CREATE DATABASE Reservas;

-- Utilizar la base de datos 'Reservas'
USE Reservas;

-- Crear la tabla 'Evento'
CREATE TABLE Evento (
    IdEvento INTEGER PRIMARY KEY AUTO_INCREMENT,
    Fecha DATE
);

-- Crear la tabla 'Mesas'
CREATE TABLE Mesas (
    IdMesa INTEGER PRIMARY KEY AUTO_INCREMENT,
    Capacidad INTEGER,
    Estado BOOLEAN,
    IdEvento INTEGER,
    FOREIGN KEY (IdEvento) REFERENCES Evento(IdEvento)
);

-- Crear la tabla 'Cliente'
CREATE TABLE Cliente (
    IdCliente INTEGER PRIMARY KEY AUTO_INCREMENT,
    Nombre TEXT,
    DNI TEXT,
    Celular TEXT,
    IdMesa INTEGER,
    FOREIGN KEY (IdMesa) REFERENCES Mesas(IdMesa)
);

-- Crear la tabla 'Miembros'
CREATE TABLE Miembros (
    IdMiembro INTEGER PRIMARY KEY AUTO_INCREMENT,
    Nombre TEXT,
    DNI TEXT,
    IdMesa INTEGER,
    FOREIGN KEY (IdMesa) REFERENCES Mesas(IdMesa)
);

-- Procedimiento para obtener los datos de la mesa y los clientes y miembros
DELIMITER //
CREATE PROCEDURE ObtenerDatosPorIdMesa(IN id_mesa INTEGER)
BEGIN
    -- Seleccionar los datos de la tabla Mesas para el IdMesa especificado
    SELECT * FROM Mesas WHERE IdMesa = id_mesa;
    -- Seleccionar los datos de la tabla Cliente para el mismo IdMesa
    SELECT * FROM Cliente WHERE IdMesa = id_mesa;
    -- Seleccionar los datos de la tabla Miembros para el mismo IdMesa
    SELECT * FROM Miembros WHERE IdMesa = id_mesa;
END //
DELIMITER ;
CALL ObtenerDatosPorIdMesa(1);

INSERT INTO Mesas (Capacidad, Estado, IdEvento) VALUES (10, FALSE, 3);

SELECT * FROM Evento;
SELECT * FROM Mesas;
SELECT * FROM Cliente;
