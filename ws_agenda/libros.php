<?php
include('config.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Capturar datos de la solicitud
$postData = json_decode(file_get_contents("php://input"), true);
//print_r($_POST);
//exit;
//$postData = $_POST;
$accion = $postData['accion'] ?? '';


switch ($accion) {
    case 'obtener_libros':
        obtenerLibros($conn);
        break;
    case 'obtener_libro':
        obtenerLibro($conn, $postData);
        break;
    case 'agregar_libro':
        agregarLibro($conn, $postData);
        break;
    case 'editar_libro':
        editarLibro($conn, $postData);
        break;
    case 'eliminar_libro':
        eliminarLibro($conn, $postData);
        break;
    default:
        echo json_encode(["estado" => false, "mensaje" => "Acción no válida"]);
        break;
}

$conn->close();

// Obtener todos los libros
function obtenerLibros($conn) {
    $sql = "SELECT * FROM libros";
    $result = $conn->query($sql);
    $libros = [];

    while ($row = $result->fetch_assoc()) {
        $libros[] = $row;
    }

    $res = json_encode(["estado" => true, "libros" => $libros]); // Asegura que "libros" sea un array

    echo $res;
}

// Obtener un solo libro por ID
function obtenerLibro($conn, $data) {
    $id = isset($data['libro_id']) ? intval($data['libro_id']) : 0;

    if ($id <= 0) {
        echo json_encode(["estado" => false, "mensaje" => "ID de libro inválido"]);
        return;
    }

    $sql = "SELECT * FROM libros WHERE id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode(["estado" => true, "libro" => $result->fetch_assoc()]);
    } else {
        echo json_encode(["estado" => false, "mensaje" => "Libro no encontrado"]);
    }
}

// Agregar un nuevo libro
function agregarLibro($conn, $data) {
    if (!isset($data['titulo'], $data['autor'], $data['fecha_publicacion'], $data['descripcion'])) {
        echo json_encode(["estado" => false, "mensaje" => "Datos incompletos"]);
        return;
    }

    $titulo = $conn->real_escape_string($data['titulo']);
    $autor = $conn->real_escape_string($data['autor']);
    $fecha_publicacion = intval($data['fecha_publicacion']);
    $descripcion = $conn->real_escape_string($data['descripcion']);
   

    $sql = "INSERT INTO libros (titulo, autor, fecha_publicacion, descripcion) 
            VALUES ('$titulo', '$autor', '$fecha_publicacion', '$descripcion')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["estado" => true, "mensaje" => "Libro agregado correctamente"]);
    } else {
        echo json_encode(["estado" => false, "mensaje" => "Error al agregar el libro"]);
    }
}

// Editar un libro existente
function editarLibro($conn, $data) {
    if (!isset($data['libro_id'], $data['titulo'], $data['autor'], $data['fecha_publicacion'], $data['descripcion'])) {
        echo json_encode(["estado" => false, "mensaje" => "Datos incompletos"]);
        return;
    }

    //print_r($data);

    $libro_id = intval($data['libro_id']);
    $titulo = $conn->real_escape_string($data['titulo']);
    $autor = $conn->real_escape_string($data['autor']);
    $fecha_publicacion = intval($data['fecha_publicacion']);
    $descripcion = $conn->real_escape_string($data['descripcion']);

    $sql = "UPDATE libros 
            SET titulo='$titulo', autor='$autor', fecha_publicacion='$fecha_publicacion', 
                descripcion='$descripcion'
            WHERE id='$libro_id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["estado" => true, "mensaje" => "Libro editado correctamente"]);
    } else {
        echo json_encode(["estado" => false, "mensaje" => "Error al editar el libro"]);
    }
}

// Eliminar un libro
function eliminarLibro($conn, $data) {
    $libro_id = intval($data['libro_id']);

    if ($libro_id <= 0) {
        echo json_encode(["estado" => false, "mensaje" => "ID de libro inválido"]);
        return;
    }

    $sql = "DELETE FROM libros WHERE id='$libro_id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["estado" => true, "mensaje" => "Libro eliminado correctamente"]);
    } else {
        echo json_encode(["estado" => false, "mensaje" => "Error al eliminar el libro"]);
    }
}
