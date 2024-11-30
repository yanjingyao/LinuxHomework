<?php
session_start();
session_unset(); // 清除会话变量
session_destroy(); // 销毁会话

header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>
