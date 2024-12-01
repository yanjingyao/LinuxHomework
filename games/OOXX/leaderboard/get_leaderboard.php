<?php
// require '../db_connect.php';
session_start();
header('Content-Type: application/json');

// 数据库连接信息
$servername = "113.45.187.135";
$username = "ooxxdb";
$password = "pwdooxxdb";
$dbname = "ooxxdb";

// 创建连接
$conn = new mysqli($servername, $username, $password, $dbname);

// 检查连接
if ($conn->connect_error) {
    die("连接失败: " . $conn->connect_error);
}

// 获取请求的排行榜类型
$type = $_GET['type'];

// 记录接收到的类型以便调试
error_log("接收到的排行榜类型: " . $type);

if ($type === 'personal') {
    // 会话或认证系统中获取
    $userId = $_SESSION['user_id'];
    $sql = "SELECT username, time, date FROM game_records WHERE user_id = $userId ORDER BY time ASC LIMIT 10";
} elseif ($type === 'world') {
    $sql = "SELECT username, time, date FROM game_records ORDER BY time ASC LIMIT 10";
} else {
    echo json_encode(array('error' => 'Invalid leaderboard type'));
    exit;
}

$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);

$conn->close();
?>