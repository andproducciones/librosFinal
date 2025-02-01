<?php
include('config.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Capturar datos de la solicitud
$postData = json_decode(file_get_contents("php://input"), true);
$accion = $postData['accion'] ?? '';

// Acciones disponibles
switch ($accion) {
    case 'obtener_resenas':
        obtenerResenas($conn, $postData);
        break;
    case 'obtener_resena':
        obtenerResenaPorId($conn, $postData);
        break;
    case 'agregar_resena':
        agregarResena($conn, $postData);
        break;
    case 'editar_resena':
        editarResena($conn, $postData);
        break;
    case 'eliminar_resena':
        eliminarResena($conn, $postData);
        break;
    case 'obtener_resenas_valoracion':
        obtenerResenasValoracion($conn, $postData);
        break;
    default:
        echo json_encode(["estado" => false, "mensaje" => "Acción no válida"]);
        break;
}

$conn->close();

// ============================ FUNCIONES PARA RESEÑAS ============================

// Obtener todas las reseñas de un libro
function obtenerResenas($conn, $data) {
    $libro_id = intval($data['libro_id']);

    if ($libro_id <= 0) {
        echo json_encode(["estado" => false, "mensaje" => "ID de libro inválido"]);
        return;
    }

    $sql = "SELECT * FROM resenas WHERE libro_id = $libro_id ORDER BY fecha DESC";
    $result = $conn->query($sql);
    $resenas = [];

    while ($row = $result->fetch_assoc()) {
        $resenas[] = $row;
    }

    echo json_encode(["estado" => true, "resenas" => $resenas]);
}

// Obtener una reseña por su ID
function obtenerResenaPorId($conn, $data) {
    $resena_id = intval($data['resena_id'] ?? 0);

    if ($resena_id <= 0) {
        echo json_encode(["estado" => false, "mensaje" => "ID de reseña inválido"]);
        return;
    }

    $sql = "SELECT * FROM resenas WHERE id = $resena_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode(["estado" => true, "resena" => $result->fetch_assoc()]);
    } else {
        echo json_encode(["estado" => false, "mensaje" => "Reseña no encontrada"]);
    }
}

// Agregar una nueva reseña
function agregarResena($conn, $data) {
    if (!isset($data['libro_id'], $data['valoracion'], $data['comentario'])) {
        echo json_encode(["estado" => false, "mensaje" => "Datos incompletos"]);
        return;
    }

    $libro_id = intval($data['libro_id']);
    $valoracion = intval($data['valoracion']);
    $comentario = $conn->real_escape_string($data['comentario']);

    $sql = "INSERT INTO resenas (libro_id, valoracion, comentario) 
            VALUES ('$libro_id', '$valoracion', '$comentario')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["estado" => true, "mensaje" => "Reseña agregada correctamente"]);
    } else {
        echo json_encode(["estado" => false, "mensaje" => "Error al agregar la reseña"]);
    }
}

// Editar una reseña existente
function editarResena($conn, $data) {
    if (!isset($data['resena_id'], $data['valoracion'], $data['comentario'], $data['libro_id'])) {
        echo json_encode(["estado" => false, "mensaje" => "Datos incompletos"]);
        return;
    }

    $resena_id = intval($data['resena_id']);
    $valoracion = intval($data['valoracion']);
    $comentario = $conn->real_escape_string($data['comentario']);

    $sql = "UPDATE resenas 
            SET valoracion = '$valoracion', comentario = '$comentario'
            WHERE id = '$resena_id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["estado" => true, "mensaje" => "Reseña actualizada correctamente"]);
    } else {
        echo json_encode(["estado" => false, "mensaje" => "Error al actualizar la reseña"]);
    }
}

// Eliminar una reseña
function eliminarResena($conn, $data) {
    $resena_id = intval($data['resena_id']);

    if ($resena_id <= 0) {
        echo json_encode(["estado" => false, "mensaje" => "ID de reseña inválido"]);
        return;
    }

    $sql = "DELETE FROM resenas WHERE id = '$resena_id'";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["estado" => true, "mensaje" => "Reseña eliminada correctamente"]);
    } else {
        echo json_encode(["estado" => false, "mensaje" => "Error al eliminar la reseña"]);
    }
}

function obtenerResenasValoracion($conn, $data) {
    $libro_id = intval($data['libro_id'] ?? 0);

    if ($libro_id <= 0) {
        echo json_encode(["estado" => false, "mensaje" => "ID de libro inválido"]);
        return;
    }

    $sql = "SELECT valoracion FROM resenas WHERE libro_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $libro_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $resenas = [];
    $suma = 0;
    $total = 0;

    while ($row = $result->fetch_assoc()) {
        $resenas[] = $row;
        $suma += $row['valoracion'];
        $total++;
    }

    // Calcular el promedio de valoración
    $promedio = $total > 0 ? round($suma / $total, 1) : 0;

    echo json_encode(["estado" => true, "promedio" => $promedio]);
}

