<?php
require 'db_connect.php';




// 插入个人历史记录
function insertPersonalRecord($username, $score, $date) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO personal_history (username, score, date) VALUES (?, ?, ?)");
    $stmt->execute([$username, $score, $date]);
}

// 插入世界记录
function insertWorldRecord($username, $score) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO world_records (username, score) VALUES (?, ?)");
    $stmt->execute([$username, $score]);
}

// 示例插入
insertPersonalRecord('player1', '00:05:30', '2023-11-19');
insertWorldRecord('player1', '00:05:30');

echo "记录插入成功！";
?>