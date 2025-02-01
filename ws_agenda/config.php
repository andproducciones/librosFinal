<?php

$host = 'localhost';
$user = 'root';
$password = '';
$db = 'app_moviles';

$conn = @mysqli_connect($host, $user, $password, $db);

if (!$conn) {
    //echo "Error: No se pudo conectar a MySQL." . PHP_EOL;   
    die("Error al conectar: " . mysqli_connect_error());
}
?>