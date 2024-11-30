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

// // 检查用户是否已登录
// if (!isset($_SESSION['user_id'])) {
//     // 用户未登录，重定向到登录页面或显示错误消息
//     header('Location: login.php'); // 或者 echo json_encode(['success' => false, 'message' => 'Please log in first']);
//     exit;
// }

// // 用户已登录，可以访问该页面
// echo "Welcome, " . $_SESSION['username'];

// // 设置会话过期时间（例如，30分钟）
// $timeout_duration = 1800; // 30分钟

// if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $timeout_duration)) {
//     // 超过过期时间，注销用户
//     session_unset(); // 清除会话变量
//     session_destroy(); // 销毁会话
//     header('Location: login.php'); // 重定向到登录页面
//     exit;
// }

// $_SESSION['LAST_ACTIVITY'] = time(); // 更新最后活动时间