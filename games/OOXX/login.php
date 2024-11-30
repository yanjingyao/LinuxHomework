<?php
require 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $verificationCode = $data['verificationCode'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($verificationCode)) {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }

    // Verify the code
    $stmt = $pdo->prepare("SELECT * FROM verification_codes WHERE email = ? AND code = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)");
    $stmt->execute([$email, $verificationCode]);
    $result = $stmt->fetch();

    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired verification code']);
        exit;
    }

    // Check if user exists
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['LAST_ACTIVITY'] = time();
        echo json_encode(['success' => true, 'message' => 'Login successful', 'username' => $user['username']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
}
