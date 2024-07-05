<?php
header('Content-Type: application/json; charset=utf-8');
$puntos = [];

function include_all_php_files($directory) {
    // Verificar si el directorio existe
    if (!is_dir($directory)) {
        throw new Exception("El directorio no existe: $directory");
    }

    // Abrir el directorio
    $dir = opendir($directory);

    // Iterar sobre cada archivo en el directorio
    while (($file = readdir($dir)) !== false) {
        // Verificar si es un archivo PHP
        if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
            include_once $directory . DIRECTORY_SEPARATOR . $file;
        }
    }

    // Cerrar el directorio
    closedir($dir);
}

// Usar la función
try {
    include_all_php_files('data/');
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

echo json_encode($puntos);
?>