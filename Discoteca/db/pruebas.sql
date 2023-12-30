SELECT * FROM Mesas WHERE IdEvento=1;
SELECT * FROM evento;
SELECT * FROM miembros;
SELECT * FROM mesas;
SELECT * FROM cliente;
INSERT INTO evento (Fecha) VALUES ('2023-12-01');

DELETE FROM evento WHERE IdEvento=6;
ALTER TABLE evento AUTO_INCREMENT = 1;

UPDATE mesas SET Estado = 1 WHERE IdMesa = 1;
INSERT INTO cliente (Nombre,DNI,Celular,IdMesa) VALUES ('Gonzalo Barrios',71329799,913498639,1);
INSERT INTO miembros (Nombre,DNI,IdMesa) VALUES ('Gonzalo Campos',88800041,3);

UPDATE cliente 
SET nombre = 'Andres Garcia', dni = '77823433', celular = '992387645', idmesa = 3 
WHERE IdCliente = 3;


DELIMITER $$
CREATE PROCEDURE GetMesaData(IN idMesa INT)
BEGIN
	SELECT IdMiembro, Nombre AS 'Nombre Miembro', DNI, miembros.IdMesa, mesas.Capacidad, mesas.Estado, mesas.IdEvento
	FROM miembros
	INNER JOIN mesas
	ON miembros.IdMesa = mesas.IdMesa
    WHERE mesas.IdMesa = idMesa;
END$$
DELIMITER ;
-- CALL GetMesaData(1);