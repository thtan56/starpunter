<?php
require_once('../php/configDb.php');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

$pdo = getPdoConnection();
$stmt = $pdo->prepare('SELECT pool, username, COUNT(*) as count FROM bet GROUP BY pool, username');
$stmt->execute();
$arr = $stmt->fetchAll(PDO::FETCH_ASSOC);
$stmt = null;

echo json_encode($arr, JSON_PRETTY_PRINT);
?>
