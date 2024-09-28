<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');
$badenes = [];

function include_all_php_files($directory) {
    global $badenes;

    if (!is_dir($directory)) {
        throw new Exception("El directorio no existe: $directory");
    }

    $dir = opendir($directory);

    while (($file = readdir($dir)) !== false) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
            include_once $directory . DIRECTORY_SEPARATOR . $file;
        }
    }

    closedir($dir);
}

// Usar la función
try {
    include_all_php_files('data/');
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}

$badenesOk = [];
foreach($badenes as $punto) {
    if (!isset($punto["latitud"]) || !isset($punto["longitud"])) continue;
    $punto["latitud"] = floatval($punto["latitud"]);
    $punto["longitud"] = floatval($punto["longitud"]);
    $punto["tipo_marcador"] = "baden";
    $badenesOk[] = $punto;
}

echo json_encode($badenesOk);
?>