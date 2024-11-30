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
                tr.style.opacity = '0';
                tr.style.transform = 'translateY(20px)';
                tableBody.appendChild(tr);

                setTimeout(() => {
                    tr.style.transition = 'all 0.3s ease';
                    tr.style.opacity = '1';
                    tr.style.transform = 'translateY(0)';
                }, 50 * index);
            });
        })
        .catch(error => console.error('Error:', error));
}

