<?php
require 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $username = $data['username'] ?? '';
    $verificationCode = $data['verificationCode'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($username) || empty($verificationCode)) {
        echo json_encode(['success' => false, 'message' => '输入无效']);
        exit;
    }

    // Verify the code
    $stmt = $pdo->prepare("SELECT * FROM verification_codes WHERE email = ? AND code = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)");
    $stmt->execute([$email, $verificationCode]);
    $result = $stmt->fetch();

    if (!$result) {
        echo json_encode(['success' => false, 'message' => '验证码无效或过期']);
        exit;
    }

    // Register the user
    try {
        $stmt = $pdo->prepare("INSERT INTO users (email, username) VALUES (?, ?)");
        $stmt->execute([$email, $username]);
        echo json_encode(['success' => true, 'message' => '注册成功']);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            echo json_encode(['success' => false, 'message' => '邮箱已被注册']);
        } else {
            echo json_encode(['success' => false, 'message' => '用户注册失败']);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => '方法不允许']);
}