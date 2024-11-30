<?php
require 'db_connect.php';

// 获取个人历史记录
function getPersonalHistory() {
    global $pdo;
    $stmt = $pdo->query("SELECT username, score, date FROM personal_history ORDER BY score ASC LIMIT 5");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// 获取世界记录
function getWorldRecords() {
    global $pdo;
    $stmt = $pdo->query("SELECT username, score FROM world_records ORDER BY score ASC LIMIT 5");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// 获取数据
$personalHistory = getPersonalHistory();
$worldRecords = getWorldRecords();

// 返回 JSON 格式的数据
header('Content-Type: application/json');
echo json_encode([
    'personalHistory' => $personalHistory,
    'worldRecords' => $worldRecords
]);
?> 