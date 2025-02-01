-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 01-02-2025 a las 01:30:16
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `app_moviles`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

DROP TABLE IF EXISTS `libros`;
CREATE TABLE IF NOT EXISTS `libros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `autor` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `fecha_publicacion` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id`, `titulo`, `autor`, `descripcion`, `fecha_publicacion`) VALUES
(2, '1984', 'George Orwell', 'Una novela distópica que presenta un futuro totalitario bajo la vigilancia constante del Gran Hermano.', '2025-01-01'),
(3, 'Don Quijote de la Mancha', 'Miguel de Cervantes', 'La historia del caballero Don Quijote y su escudero Sancho Panza en su lucha por la justicia y la aventura.', '2025-01-01'),
(4, 'Orgullo y prejuicio', 'Jane Austen', 'Una novela romántica sobre el amor y el matrimonio en la sociedad inglesa del siglo XIX.', '1813-01-28'),
(5, 'El señor de los anillos', 'J.R.R. Tolkien', 'Una de las obras de fantasía más influyentes, que sigue la lucha entre el bien y el mal en la Tierra Media.', '1954-07-29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

DROP TABLE IF EXISTS `persona`;
CREATE TABLE IF NOT EXISTS `persona` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `correo` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `cedula` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `estatus` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`id`, `nombre`, `apellido`, `correo`, `cedula`, `password`, `estatus`) VALUES
(1, 'Juan', 'Pérez', 'juan.perez@example.com', '0987654321', 'contrasena123', 1),
(2, 'María', 'González', 'maria.gonzalez@example.com', '0998765432', 'miClaveSegura', 1),
(3, 'Carlos', 'Ramírez', 'carlos.ramirez@example.com', '0976543210', 'password123', 1),
(4, 'Ana', 'López', 'ana.lopez@example.com', '0965432109', '1234abcde', 1),
(5, 'Luis', 'Martínez', 'luis.martinez@example.com', '0954321098', 'claveSimple', 1),
(8, 'Francis', 'Fiallos', 'francis_andre94@hotmail.com', '1234', '1234', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenas`
--

DROP TABLE IF EXISTS `resenas`;
CREATE TABLE IF NOT EXISTS `resenas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `libro_id` int NOT NULL,
  `comentario` text COLLATE utf8mb4_general_ci,
  `valoracion` int DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `libro_id` (`libro_id`)
) ;

--
-- Volcado de datos para la tabla `resenas`
--

INSERT INTO `resenas` (`id`, `usuario_id`, `libro_id`, `comentario`, `valoracion`, `fecha`) VALUES
(1, 1, 1, 'Una obra maestra que me transportó a Macondo. La narrativa de Gabriel García Márquez es única.', 9, '2025-01-01 19:30:00'),
(2, 2, 1, 'Muy buen libro, aunque algunos pasajes se sienten un poco densos.', 8, '2025-01-03 15:15:00'),
(12, 0, 5, 'sdfsdfsdfsdfddddddddssss', 5, '2025-01-31 23:23:33'),
(4, 4, 2, 'Me gustó la historia, pero algunas partes fueron difíciles de seguir.fff', 7, '2025-01-07 14:20:00'),
(5, 5, 3, 'Un clásico imprescindible. La locura de Don Quijote y la lealtad de Sancho Panza me hicieron reír y reflexionar.', 10, '2025-01-10 18:10:00'),
(6, 6, 3, 'La obra es excelente, pero se necesita paciencia para disfrutarla por completo.', 8, '2025-01-12 16:00:00'),
(7, 7, 4, 'Jane Austen muestra de manera brillante las tensiones sociales y los matices del amor.', 9, '2025-01-14 20:30:00'),
(8, 8, 4, 'No fue lo que esperaba, aunque los personajes están bien desarrollados.', 6, '2025-01-15 23:45:00'),
(9, 9, 5, 'La Tierra Media de Tolkien es un mundo mágico que me cautivó por completo. ¡Impresionante!', 10, '2025-01-19 01:00:00'),
(10, 10, 5, 'Un viaje épico lleno de aventuras y personajes inolvidables. Altamente recomendado.', 9, '2025-01-19 14:50:00'),
(14, 0, 12, 'dfdsfsdf', 5, '2025-01-31 23:51:43');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
