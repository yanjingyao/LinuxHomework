// 示例数据
const personalHistory = [
    { rank: 1, score: "00:00:00", date: "2023-11-19" },
    { rank: 2, score: "00:00:00", date: "2023-11-18" },
    { rank: 3, score: "00:00:00", date: "2023-11-17" },
    { rank: 4, score: "00:00:00", date: "2023-11-16" },
    { rank: 5, score: "00:00:00", date: "2023-11-15" }
];

const worldRecords = [
    { rank: 1, username: "player1", score: "00:00:00" },
    { rank: 2, username: "player2", score: "00:00:00" },
    { rank: 3, username: "player3", score: "00:00:00" },
    { rank: 4, username: "player4", score: "00:00:00" },
    { rank: 5, username: "player5", score: "00:00:00" }
];

// 填充个人历史表格
function populatePersonalHistory() {
    const table = document.getElementById('personal-history').getElementsByTagName('tbody')[0];
    personalHistory.forEach(entry => {
        let row = table.insertRow();
        row.insertCell(0).textContent = entry.rank;
        row.insertCell(1).textContent = entry.score;
        row.insertCell(2).textContent = entry.date;
    });
}

// 填充世界记录表格
function populateWorldRecords() {
    const table = document.getElementById('world-records').getElementsByTagName('tbody')[0];
    worldRecords.forEach(entry => {
        let row = table.insertRow();
        row.insertCell(0).textContent = entry.rank;
        row.insertCell(1).textContent = entry.username;
        row.insertCell(2).textContent = entry.score;
    });
}

// 页面加载时填充表格
window.onload = function() {
    populatePersonalHistory();
    populateWorldRecords();
};