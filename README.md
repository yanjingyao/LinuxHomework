# LinuxHomework
# OOXX 游戏项目开源说明
## 项目概述
OOXX 是一个基于网页的游戏，允许用户进行在线对战并记录游戏历史。该项目包括用户登录、注册、游戏记录、排行榜等功能。以下是项目的主要文件和功能说明。
## 文件结构
### 1. 数据库连接
**`db_connect.php`**
```
<?php
$host = 'localhost';
$db   = 'ooxxdb';
$user = 'ooxxdb';
$pass = 'pwdooxxdb';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>
```
- 该文件用于连接 MySQL 数据库，使用 PDO 进行安全的数据库操作。

### 2. 用户登录
**`login.php`**
```
<?php
require 'db_connect.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $verificationCode = $data['verificationCode'] ?? '';

    // 验证输入
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || empty($verificationCode)) {
        echo json_encode(['success' => false, 'message' => 'Invalid input']);
        exit;
    }

    // 验证验证码
    $stmt = $pdo->prepare("SELECT * FROM verification_codes WHERE email = ? AND code = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)");
    $stmt->execute([$email, $verificationCode]);
    $result = $stmt->fetch();

    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired verification code']);
        exit;
    }

    // 检查用户是否存在
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        echo json_encode(['success' => true, 'message' => 'Login successful', 'username' => $user['username']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
}
?>
```
- 处理用户登录请求，验证用户的电子邮件和验证码。
### 3. 游戏记录
**`insert_records.php`**
```
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
    $userId = $_SESSION['user_id'];
    $username = $_SESSION['username'];
    $score = $data['score'];
    $date = date('Y-m-d H:i:s');

    // 插入记录
    insertPersonalRecord($userId, $username, $score, $date);
    echo json_encode(['success' => true, 'message' => '记录插入成功！']);
} else {
    echo json_encode(['success' => false, 'message' => '无效的请求方法']);
}
?>
- 处理游戏记录的插入，记录用户的游戏成绩和时间。
### 4. 排行榜
**`get_leaderboard.php`**
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
```
- 提供个人历史记录和世界记录的接口，返回 JSON 格式的数据。
### 5. 前端代码
**`leaderboard/script.js`**
```
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const leaderboards = document.querySelectorAll('.leaderboard');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            leaderboards.forEach(l => {
                l.classList.remove('active');
                l.style.display = 'none';
            });

            btn.classList.add('active');
            const activeLeaderboard = document.getElementById(tabId);
            activeLeaderboard.style.display = 'block';
            setTimeout(() => {
                activeLeaderboard.classList.add('active');
            }, 50);

            fetchLeaderboard(tabId);
        });
    });

    // 初始加载个人游戏历史榜
    fetchLeaderboard('personal');
});

function fetchLeaderboard(type) {
    fetch(`get_leaderboard.php?type=${type}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector(`#${type}-table tbody`);
            tableBody.innerHTML = '';

            data.forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row.username}</td>
                    <td>${row.time}</td>
                    <td>${row.date}</td>
                `;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error:', error));
}
```
- 处理排行榜的前端逻辑，包括切换标签和获取排行榜数据。
### 6. 样式文件
**`styles.css`**
```
body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background-color: #f3f4f6;
}

.container {
    background-color: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 32rem;
    width: 100%;
}
```
- 定义了页面的基本样式，包括字体、背景颜色和容器样式。
## 结论
该项目展示了如何使用 PHP 和 MySQL 创建一个简单的在线游戏记录系统。用户可以登录、注册、记录游戏成绩并查看排行榜。欢迎大家参与贡献和改进！
