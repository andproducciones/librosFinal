<?php

include('config.php');
//echo 1;
//exit;

// Configurar encabezados para permitir CORS
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept');
header('Content-Type: application/json; charset=utf-8');


//// Leer el cuerpo de la solicitud
$post = json_decode(file_get_contents('php://input'), true);

// Verificar si hay acción definida
//print_r($post);

if (!isset($post['accion'])) {
    echo json_encode(['code' => 400, 'response' => 'Acción no definida']);
    exit;
}
// Variable para la respuesta
$respuesta = [];

try {
    switch ($post['accion']) {
        case 'login':
            try {
                if (!isset($post['email'], $post['password'])) {
                    throw new Exception("Parámetros incompletos para login.");
                }
        
                $email = trim($post['email']);
                $password = trim($post['password']);
        
                if (empty($email) || empty($password)) {
                    throw new Exception("Email y contraseña son obligatorios.");
                }
        
                // Consulta segura con prepared statements
                $sql = "SELECT * FROM persona WHERE correo = ?";
                $stmt = mysqli_prepare($conn, $sql);
                
                if (!$stmt) {
                    throw new Exception("Error en la preparación de la consulta: " . mysqli_error($conn));
                }
        
                mysqli_stmt_bind_param($stmt, "s", $email);
                mysqli_stmt_execute($stmt);
                $result = mysqli_stmt_get_result($stmt);
        
                if (!$result) {
                    throw new Exception("Error en la ejecución de la consulta: " . mysqli_error($conn));
                }
        
                if ($row = mysqli_fetch_assoc($result)) {
                    // Verificar la contraseña
                    if ($password == $row['password']) {
                        // Eliminar la contraseña del array antes de enviarla en la respuesta
                        unset($row['password']);
                        $respuesta = [
                            'code' => 200,
                            'response' => 'Inicio de sesión exitoso',
                            'estado' => true,
                            'data' => $row
                        ];
                    } else {
                        throw new Exception("Credenciales inválidas.");
                    }
                } else {
                    throw new Exception("Correo desconocido.");
                }
        
                mysqli_stmt_close($stmt);
            } catch (Exception $e) {
                $respuesta = [
                    'code' => 400,
                    'response' => $e->getMessage(),
                    'estado' => false
                ];
            }
            break;
        
        case 'insertarPersona':

            //print($post);
            //exit;
            if (!isset($post['nombre'], $post['apellido'], $post['correo'], $post['cedula'], $post['password'])) {
                throw new Exception("Parámetros incompletos para insertar persona.");
            }

            //$hashedPassword = password_hash($post['password'], PASSWORD_BCRYPT);

            // Preparar el query SQL
            $sql = sprintf(
                "INSERT INTO persona (nombre, apellido, correo, cedula, password) 
                VALUES ('%s', '%s', '%s', '%s', '%s')",
                mysqli_real_escape_string($conn, $post['nombre']),
                mysqli_real_escape_string($conn, $post['apellido']),
                mysqli_real_escape_string($conn, $post['correo']),
                mysqli_real_escape_string($conn, $post['cedula']),
                mysqli_real_escape_string($conn, $post['password'])
            
            );

            // Ejecutar el query
            if (!mysqli_query($conn, $sql)) {
                throw new Exception("Error al insertar persona: " . mysqli_error($conn));
            }

            $respuesta = ['code' => 200, 'response' => 'Persona insertada correctamente', 'estado' => true];
            
            break;

            case 'recuperarContrasena':
                if (!isset($post['email'])) {
                    throw new Exception("Correo electrónico requerido para recuperar la contraseña.");
                }
    
                $email = $post['email'];
    
                // Verificar si el correo existe en la base de datos
                $sql = sprintf(
                    "SELECT password FROM persona WHERE correo='%s'",
                    mysqli_real_escape_string($conn, $email)
                );
                $query = mysqli_query($conn, $sql);
    
                if (!$query) {
                    throw new Exception("Error en la consulta: " . mysqli_error($conn));
                }
    
                if ($query->num_rows > 0) {
                    $row = $query->fetch_assoc();
                    $password = $row['password'];
    
                        // Configurar datos del correo
                    $asunto = "Recuperación de Contraseña";
                    $mensaje = "Hola, hemos recibido tu solicitud de recuperación de contraseña.\n\n" .
                            "Tu contraseña es: $password\n\n" .
                            "Te recomendamos cambiarla inmediatamente después de acceder a tu cuenta.\n\n" .
                            "Saludos,\nEl equipo de soporte.";
                    $encabezados = "From: biblioteca@andproducciones.com";

                    // Enviar correo
                    if (mail($email, $asunto, $mensaje, $encabezados)) {
                        $respuesta = [
                            'code' => 200,
                            'response' => 'Contraseña enviada exitosamente al correo.',
                            'estado' => true
                        ];
                    }
                } else {
                    throw new Exception("Correo no encontrado.");
                }
                break;

        default:
            throw new Exception("Acción inválida.");
        }
} catch (Exception $e) {
    // Capturar errores y enviar como respuesta
    $respuesta = [
        'code' => 400,
        'response' => $e->getMessage(),
        'estado' => false
    ];
}

// Enviar respuesta como JSON
echo json_encode($respuesta);

?>
