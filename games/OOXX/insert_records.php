<?php
require 'db_connect.php';
session_start();

// 插入个人历史记录
function insertPersonalRecord($userId, $username, $score, $date) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO game_records (user_id, username, time, date) VALUES (?, ?, ?, ?)");
    $stmt->execute([$userId, $username, $score, $date]);
}

// 检查请求方法
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $_SESSION['user_id']; // 获取用户ID
    $username = $_SESSION['username'];  // 获取用户名
    $score = $data['score']; // 默认分数
    $date = date('Y-m-d H:i:s'); // 当前时间

    // 插入记录
    insertPersonalRecord($userId, $username, $score, $date);

    echo json_encode(['success' => true, 'message' => '记录插入成功！']);
} else {
    echo json_encode(['success' => false, 'message' => '无效的请求方法']);
}
?>