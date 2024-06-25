<?php
header('Content-Type: application/json; charset=utf-8');
$puntos = [];

include("data/ejemplo.php");

echo json_encode($puntos);
?>