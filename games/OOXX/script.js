let boardSize = 6;
let board = [];
let fixedBoard = []; // 新增：用于记录固定棋子的状态
let timerInterval;
let startTime;
let isTimerRunning = false;
const timerElement = document.getElementById('timer');

const boardElement = document.getElementById('board');
const boardSizeSelect = document.getElementById('board-size');
const hintButton = document.getElementById('hint-button');
const checkSolutionButton = document.getElementById('check-solution');
const resetGameButton = document.getElementById('reset-games');
const messageElement = document.getElementById('message');
const hintModal = document.getElementById('hint-modal');
const hintText = document.getElementById('hint-text');
const closeModal = document.getElementsByClassName('close')[0];

let isGameSolved = false; // 新增：跟踪游戏是否已解开

/**
 * 寻找下一个空格
 * @param {Array} board - 当前棋盘
 * @returns {Array|null} - 返回空格的坐标或 null
 */
function findEmptyCell(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '') {
                console.log(`找到空格：[${i}, ${j}]`);
                return [i, j];
            }
        }
    }
    console.log("没有找到空格");
    return null; // 如果没有空格，返回 null
}

/**
 * 求解棋盘
 * @param {Array} board - 当前棋盘
 * @param {Array} fixedBoard - 固定棋子状态
 * @returns {boolean} - 是否成功填充棋盘
 */
function solveBoard(board, fixedBoard) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        console.log("棋盘已填充完成");
        return true; // 已完成填充
    }

    const [row, col] = emptyCell;
    const possibleValues = ['X', 'O'];

    for (let value of possibleValues) {
        console.log(`尝试填充 [${row}, ${col}] 为 ${value}`);
        if (isValidPlacement(board, row, col, value)) {
            board[row][col] = value;
            fixedBoard[row][col] = true;

            // 递归填充下一个空格
            if (solveBoard(board, fixedBoard)) {
                return true; // 找到唯一解
            }

            // 回溯
            board[row][col] = '';
            fixedBoard[row][col] = false;
        } else {
            console.log(`[${row}, ${col}] 为 ${value} 不合法`);
        }
    }

    console.log("无法填充 [", row, ",", col, "]");
    return false; // 如果递归失败，返回 false
}


/**
 * 检查棋盘的有效性
 * @param {Array} board - 当前棋盘
 * @returns {boolean} - 是否只有一个解
 */
function isValidBoard(board) {
    let solutionCount = 0;

    // 回溯求解
    function backtrack(board) {
        const emptyCell = findEmptyCell(board);
        if (!emptyCell) {
            solutionCount++;
            return;
        }

        const [row, col] = emptyCell;
        const possibleValues = ['X', 'O'];

        for (let value of possibleValues) {
            if (isValidPlacement(board, row, col, value)) {
                board[row][col] = value;
                backtrack(board);
                if (solutionCount > 1) return; // 如果找到多个解，则提前终止
                board[row][col] = ''; // 回溯
            }
        }
    }

    backtrack(board);
    return solutionCount === 1; // 确保只找到一个解
}


// 监听 board-size select 组件的变化
boardSizeSelect.addEventListener('change', (event) => {
    const selectedSize = parseInt(event.target.value); // 获取选择的棋盘大小
    initializeBoard(selectedSize); // 根据选择的大小重新初始化棋盘
});


/**
 * 初始化棋盘
 * @param {number} size - 棋盘的大小
 */
function initializeBoard(size) {
    boardSize = size; // 设置新的棋盘大小
    board = Array(size).fill().map(() => Array(size).fill('')); // 创建空的棋盘
    fixedBoard = Array(size).fill().map(() => Array(size).fill(false)); // 初始化固定棋子记录

    // 生成一个完整的有效棋盘
    generateCompleteBoard();

    renderBoard(); // 渲染棋盘
}

/**
 * 随机打乱数组顺序的辅助函数
 * @param {Array} array - 需要打乱顺序的数组
 * @returns {Array} - 打乱顺序后的数组
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 交换元素
    }
    return array;
}



/**
 * 生成一个完整的有效棋盘，并在每一行随机消除两个棋子
 */
function generateCompleteBoard() {
    // 重置棋盘
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(''));
    fixedBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(false)); // 重置固定棋子记录

    console.log("初始棋盘：", board);

    // 使用回溯算法生成有效的棋盘
    const isBoardValid = solveBoard(board, fixedBoard);
    if (!isBoardValid) {
        console.error('无法生成有效棋盘');
        alert("生成棋盘失败，请检查棋盘规则！");
    } else {
        console.log("生成的有效棋盘：", board);

        // 在每一行随机消除两个棋子
        removeTwoRandomCellsPerRow();
    }
}

/**
 * 每一行随机消除两个棋子
 */
function removeTwoRandomCellsPerRow() {
    for (let row = 0; row < boardSize; row++) {
        // 获取当前行中已填充的格子索引
        const filledCells = [];
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] !== '') {
                filledCells.push(col);
            }
        }

        // 如果当前行有两个或更多的已填充格子，随机选择两个消除
        if (filledCells.length >= 2) {
            const cellsToRemove = getRandomTwoCells(filledCells);
            cellsToRemove.forEach(col => {
                board[row][col] = ''; // 清空随机选择的格子
                fixedBoard[row][col] = false; // 更新 fixedBoard 使该格子可填充
            });
        }
    }

    console.log("随机消除两个棋子后的棋盘：", board);
}


/**
 * 从已填充的格子中随机选择两个格子
 * @param {Array} filledCells - 已填充的格子索引
 * @returns {Array} - 随机选择的两个格子索引
 */
function getRandomTwoCells(filledCells) {
    // 确保随机选择两个不重复的格子
    const randomIndexes = [];
    while (randomIndexes.length < 2) { // 修正：只选择两个格子
        const randomIndex = Math.floor(Math.random() * filledCells.length);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }

    // 返回选择的列索引
    return randomIndexes.map(index => filledCells[index]);
}


/**
 * 求解棋盘，确保每次生成的棋盘是唯一的
 * @param {Array} board - 当前棋盘
 * @param {Array} fixedBoard - 固定棋子状态
 * @returns {boolean} - 是否成功填充棋盘
 */
function solveBoard(board, fixedBoard) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        console.log("棋盘已填充完成");
        return true; // 已完成填充
    }

    const [row, col] = emptyCell;
    const possibleValues = ['X', 'O'];

    // 随机打乱填充顺序
    const shuffledValues = shuffleArray([...possibleValues]);

    for (let value of shuffledValues) {
        console.log(`尝试填充 [${row}, ${col}] 为 ${value}`);
        if (isValidPlacement(board, row, col, value)) {
            board[row][col] = value;
            fixedBoard[row][col] = true;

            // 递归填充下一个空格
            if (solveBoard(board, fixedBoard)) {
                return true; // 找到唯一解
            }

            // 回溯
            board[row][col] = '';
            fixedBoard[row][col] = false;
        } else {
            console.log(`[${row}, ${col}] 为 ${value} 不合法`);
        }
    }

    console.log("无法填充 [", row, ",", col, "]");
    return false; // 如果递归失败，返回 false
}




// 检查某行或某列是否符合规则
function isValidPlacement(board, row, col, value) {
    // 临时放置值，检查是否有效
    board[row][col] = value;

    // 检查行和列是否符合规则
    const isRowValid = isValidLine(board[row]);
    const isColValid = isValidLine(board.map(r => r[col]));

    // 检查是否有超过三个连续相同的字符
    const hasConsecutive = hasConsecutiveThree(board[row]) || hasConsecutiveThree(board.map(r => r[col]));
    if (hasConsecutive) {
        console.log(`[${row}, ${col}] 位置的行或列有超过三个连续相同的字符`);
    }

    // 检查是否有重复行或列，只有在棋盘已填充时才检查
    const hasDuplicateRowsCheck = board[row].every(cell => cell !== '') && hasDuplicateRows(board);
    const hasDuplicateColsCheck = board[col].every(cell => cell !== '') && hasDuplicateCols(board);

    // 恢复原始状态
    board[row][col] = '';

    // 返回是否所有规则都通过
    return isRowValid && isColValid && !hasConsecutive && !hasDuplicateRowsCheck && !hasDuplicateColsCheck;
}



// 检查某一行或列是否有超过三个连续相同的字符
function hasConsecutiveThree(line) {
    let count = 1;
    for (let i = 1; i < line.length; i++) {
        if (line[i] === line[i - 1] && line[i] !== '') {
            count++;
            if (count >= 3) { // 修正：改为大于等于3
                return true; // 找到超过三个相同字符
            }
        } else {
            count = 1; // 重置计数
        }
    }
    return false; // 没有超过三个相同字符
}

// 检查是否有重复行
function hasDuplicateRows(board) {
    const rows = board.filter(row => row.every(cell => cell !== '')); // 只检查完全填充的行
    const rowsSet = new Set(rows.map(row => row.join(','))); // 将行转为字符串，并使用 Set 去重
    return rows.length !== rowsSet.size; // 如果有重复行，返回 true
}

// 检查是否有重复列
function hasDuplicateCols(board) {
    const cols = [];
    for (let col = 0; col < board[0].length; col++) {
        const column = [];
        for (let row = 0; row < board.length; row++) {
            column.push(board[row][col]);
        }
        if (column.every(cell => cell !== '')) { // 只检查完全填充的列
            cols.push(column);
        }
    }
    const colsSet = new Set(cols.map(col => col.join(','))); // 将列转为字符串，并使用 Set 去重
    return cols.length !== colsSet.size; // 如果有重复列，返回 true
}



/**
 * 检查行或列是否有效
 * @param {Array} line - 一行或一列
 * @returns {boolean} - 是否有效
 */
function isValidLine(line) {
    const countX = line.filter(cell => cell === 'X').length;
    const countO = line.filter(cell => cell === 'O').length;
    return countX <= Math.floor(boardSize / 2) && countO <= Math.floor(boardSize / 2);
}


function handleCellClick(row, col) {
    if (isGameSolved || fixedBoard[row][col]) return; // 禁止在游戏结束后点击任何格子

    startTimer(); // 开始计时

    // 根据当前状态更新格子内容
    if (board[row][col] === '') {
        board[row][col] = 'X';
    } else if (board[row][col] === 'X') {
        board[row][col] = 'O';
    } else {
        board[row][col] = '';
    }

    renderBoard();
    checkConsecutiveThree();
    checkIdenticalLines();
    checkExcessiveCount();
}


/**
 * 渲染棋盘到页面
 */
function renderBoard() {
    boardElement.innerHTML = '';
    boardElement.className = `board size-${boardSize}`;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('button');
            cell.className = 'cell';
            cell.textContent = board[i][j];

            // 给固定的棋子添加样式，且禁用点击事件
            if (fixedBoard[i][j] || isGameSolved) { // 如果游戏已解开，禁用所有单元格
                cell.classList.add('fixed'); // 给固定棋子添加样式
                cell.setAttribute('disabled', true);  // 禁用点击
            } else {
                // 非固定棋子，添加点击事件
                cell.addEventListener('click', () => handleCellClick(i, j));
            }

            // 如果是'X'或者'O'，分别为它们添加类名，方便样式控制
            if (board[i][j] === 'X') {
                cell.classList.add('x');
            } else if (board[i][j] === 'O') {
                cell.classList.add('o');
            }

            cell.setAttribute('aria-label', `Cell ${i + 1},${j + 1}: ${board[i][j] || 'Empty'}`);
            boardElement.appendChild(cell);
        }
    }
}

/**
 * 处理单元格点击事件
 * @param {number} row - 行索引
 * @param {number} col - 列索引
 */
//This function is now redundant, as it's replaced by the updated handleCellClick function above.

/**
 * 检查游戏是否已解开
 */
function checkGameStatus() {
    if (isValidBoard(board)) {
        messageElement.textContent = '恭喜你，游戏已完成！';
        isGameSolved = true; // 设置游戏已解开标志
    }
}

/**
 * 游戏计时
 */
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 100);
    }
}

/**
 * 停止计时
 */
function stopTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
    }
}

/**
 * 更新计时器显示
 */
function updateTimer() {
    const elapsedTime = Date.now() - startTime; // 计算经过的时间（毫秒）
    const minutes = Math.floor(elapsedTime / 60000).toString().padStart(2, '0'); // 计算分钟
    const seconds = Math.floor((elapsedTime % 60000) / 1000).toString().padStart(2, '0'); // 计算秒
    const milliseconds = Math.floor((elapsedTime % 1000) / 10).toString().padStart(2, '0'); // 计算毫秒（以10毫秒为单位）
    timerElement.textContent = `${minutes}:${seconds}:${milliseconds}`; // 显示格式为 mm:ss:ms
}


/**
 * 检查一行的有效性
 * @param {Array} line - 棋盘的一行
 * @returns {boolean} - 行是否有效
 */
function isValidLine(line) {
    const lineStr = line.join('');
    const maxCount = boardSize / 2;
    return !lineStr.includes('XXX') && !lineStr.includes('OOO') &&
           (line.filter(cell => cell === 'X').length <= maxCount) &&
           (line.filter(cell => cell === 'O').length <= maxCount);
}

/**
 * 检查解答的正确性
 */
function checkSolution() {
    if (board.some(row => row.includes(''))) {
        showMessage('请填完所有格子', 'error');
        return;
    }

    // 检查是否有连续三个相同的字符
    for (let i = 0; i < boardSize; i++) {
        if (hasConsecutiveThree(board[i])) {
            showMessage('棋盘中有连续的三个相同的字符', 'error');
            return;
        }
        if (hasConsecutiveThree(board.map(row => row[i]))) {
            showMessage('棋盘中有连续的三个相同的字符', 'error');
            return;
        }
    }

    // 检查每行和每列的O和X数量
    for (let i = 0; i < boardSize; i++) {
        const rowCountX = board[i].filter(cell => cell === 'X').length;
        const rowCountO = board[i].filter(cell => cell === 'O').length;
    
        if (rowCountX > boardSize/2 || rowCountO > boardSize/2) {
            showMessage('某一行的X或O数量超过'+boardSize/2 +'个', 'error');
            return;
        }
    
        const colCountX = board.map(row => row[i]).filter(cell => cell === 'X').length;
        const colCountO = board.map(row => row[i]).filter(cell => cell === 'O').length;
    
        if (colCountX > boardSize/2 || colCountO > boardSize/2) {
            showMessage('某一列的X或O数量超过'+boardSize/2+'个', 'error');
            return;
        }
    }

    // 检查是否有完全相同的行或列
    const rowStrings = board.map(row => row.join(''));
    const colStrings = board[0].map((_, i) => board.map(row => row[i]).join(''));

    if (new Set(rowStrings).size !== boardSize || new Set(colStrings).size !== boardSize) {
        showMessage('不能有两行或两列完全相同', 'error');
        return;
    }

    // 检查每行和每列是否有超过三个连续的O或X
    for (let i = 0; i < boardSize; i++) {
        if (hasMoreThanThreeConsecutive(board[i])) {
            showMessage('某一行有超过三个连续的相同字符', 'error');
            return;
        }
        if (hasMoreThanThreeConsecutive(board.map(row => row[i]))) {
            showMessage('某一列有超过三个连续的相同字符', 'error');
            return;
        }
    }

    stopTimer(); // 停止计时
    showMessage(`恭喜！你解开了谜题！用时：${timerElement.textContent}`, 'success');
    // refreshLeaderboards(); // 刷新排行榜
    
    alert(`恭喜！你解开了谜题！用时：${timerElement.textContent}`);
    resetGame(); // 重置游戏
    isGameSolved = false; // 设置游戏已解关闭的标志
}

/**
 * 检查一行或一列中是否有连续三个相同的字符
 * @param {Array} line - 棋盘的一行或一列
 * @returns {boolean} - 是否有连续三个相同的字符
 */
function hasConsecutiveThree(line) {
    const lineStr = line.join('');
    return lineStr.includes('XXX') || lineStr.includes('OOO');
}

/**
 * 检查一行或一列中是否有超过三个相同的字符
 * @param {Array} line - 棋盘的一行或一列
 * @returns {boolean} - 是否有超过三个相同的字符
 */
function hasMoreThanThreeConsecutive(line) {
    let count = 1; // 初始化计数
    for (let i = 1; i < line.length; i++) {
        if (line[i] === line[i - 1] && line[i] !== '') {
            count++;
            if (count > 3) {
                return true; // 找到超过三个相同字符
            }
        } else {
            count = 1; // 重置计数
        }
    }
    return false; // 没有超过三个相同字符
}

/**
 * 显示消息
 * @param {string} text - 消息文本
 * @param {string} type - 消息类型（成功或错误）
 */
function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'flex';
}

/**
 * 隐藏消息
 */
function hideMessage() {
    messageElement.style.display = 'none';
}

/**
 * 重置游戏
 */
function resetGame() {
    initializeBoard(boardSize);
    hideMessage();
    stopTimer(); // 停止计时
    isGameSolved = false
    timerElement.textContent = '00:00:00'; // 重置计时器显示
}


// 新增功能：排行榜功能
async function refreshLeaderboards() {
    try {
        const response = await fetch('get_leaderboards.php');
        const data = await response.json(); // 假设返回 JSON 格式的数据

        // 更新排行榜
        personalHistory = data.personalHistory;
        worldRecords = data.worldRecords;

        populatePersonalHistory();
        populateWorldRecords();
    } catch (error) {
        showMessage('刷新排行榜失败，请稍后重试', 'error');
        console.error('刷新排行榜失败:', error);
    }
}


/**
 * 生成提示信息
 * @returns {string} - 提示信息
 */
let cachedHint = null;

function generateHint() {
    if (cachedHint) return cachedHint;

    let hintText = "解题思路：\n";
    hintText += "1. 检查每行每列，确保没有连续的三个X或O。\n";
    hintText += `2. 每行每列必须恰好有${boardSize / 2}个X和${boardSize / 2}个O。\n`;
    hintText += "3. 如果一行或一列已经有两个X，那么剩下的空格必须填O，反亦然。\n";
    hintText += "4. 注意每行每列都必须是唯一的，不能有完全相同的行或列。\n";
    hintText += "5. 利用已填写的格子推理其他格子的可能性，逐步填写。\n";
    hintText += "6. 如果遇到困难，尝试假设某个空格是X或O，然后看是否会导致矛盾。\n";

    cachedHint = hintText;
    return hintText;
}


hintButton.addEventListener('click', () => {
    hintText.innerHTML = generateHint().split('\n').map(line => `<p>${line}</p>`).join('');
    hintModal.style.display = 'block';
});


document.addEventListener('DOMContentLoaded', () => {
    // 确保在 DOM 加载完成后再添加事件监听器
    const hintButton = document.getElementById('hint-button');
    const checkSolutionButton = document.getElementById('check-solution');
    const resetGameButton = document.getElementById('reset-games');

    hintButton.addEventListener('click', () => {
        hintText.innerHTML = generateHint().split('\n').map(line => `<p>${line}</p>`).join('');
        hintModal.style.display = 'block';
    });

    checkSolutionButton.addEventListener('click', checkSolution);
    resetGameButton.addEventListener('click', resetGame);

    initializeBoard(boardSize); // 确保在 DOM 加载完成后初始化棋盘
});

// Add these functions at the end of the file

// Function to check for three consecutive same characters
function checkConsecutiveThree() {
  const cells = document.querySelectorAll('.cell');
  const flashDuration = 2000; // 2 seconds

  // Check rows and columns
  for (let i = 0; i < boardSize; i++) {
    // Check row
    checkLine(i * boardSize, 1);
    // Check column
    checkLine(i, boardSize);
  }

  function checkLine(start, step) {
    for (let i = start; i < start + (boardSize - 2) * step; i += step) {
      if (cells[i].textContent &&
          cells[i].textContent === cells[i + step].textContent &&
          cells[i].textContent === cells[i + step * 2].textContent) {
        flashCells([cells[i], cells[i + step], cells[i + step * 2]], flashDuration);
      }
    }
  }
}

// Function to check for identical rows or columns
function checkIdenticalLines() {
  const cells = document.querySelectorAll('.cell');
  const flashDuration = 2000; // 2 seconds

  // Check rows
  for (let i = 0; i < boardSize; i++) {
    for (let j = i + 1; j < boardSize; j++) {
      if (compareLines(i * boardSize, j * boardSize, 1)) {
        flashCells(
          [...Array(boardSize)].map((_, k) => cells[i * boardSize + k]),
          flashDuration
        );
        flashCells(
          [...Array(boardSize)].map((_, k) => cells[j * boardSize + k]),
          flashDuration
        );
      }
    }
  }

  // Check columns
  for (let i = 0; i < boardSize; i++) {
    for (let j = i + 1; j < boardSize; j++) {
      if (compareLines(i, j, boardSize)) {
        flashCells(
          [...Array(boardSize)].map((_, k) => cells[i + k * boardSize]),
          flashDuration
        );
        flashCells(
          [...Array(boardSize)].map((_, k) => cells[j + k * boardSize]),
          flashDuration
        );
      }
    }
  }
}

function compareLines(start1, start2, step) {
  const cells = document.querySelectorAll('.cell');
  for (let i = 0; i < boardSize; i++) {
    if (cells[start1 + i * step].textContent !== cells[start2 + i * step].textContent) {
      return false;
    }
  }
  return true;
}

// Function to check if X or O count exceeds half of the board size in any row or column
function checkExcessiveCount() {
  const cells = document.querySelectorAll('.cell');
  const flashDuration = 2000; // 2 seconds
  const maxCount = boardSize / 2;

  // Check rows
  for (let i = 0; i < boardSize; i++) {
    const rowCells = [...Array(boardSize)].map((_, j) => cells[i * boardSize + j]);
    checkLineCount(rowCells);
  }

  // Check columns
  for (let i = 0; i < boardSize; i++) {
    const colCells = [...Array(boardSize)].map((_, j) => cells[i + j * boardSize]);
    checkLineCount(colCells);
  }

  function checkLineCount(lineCells) {
    const xCount = lineCells.filter(cell => cell.textContent === 'X').length;
    const oCount = lineCells.filter(cell => cell.textContent === 'O').length;
    if (xCount > maxCount || oCount > maxCount) {
      flashCells(lineCells, flashDuration);
    }
  }
}

// Function to flash cells
function flashCells(cells, duration) {
  cells.forEach(cell => {
    cell.classList.add('flash');
    setTimeout(() => {
      cell.classList.remove('flash');
    }, duration);
  });
}


// Add CSS class for flashing effect
const style = document.createElement('style');
style.textContent = `
  .flash {
    animation: flash 0.5s ease-in-out infinite alternate;
  }
  @keyframes flash {
    from { opacity: 1; }
    to { opacity: 0.5; }
  }
`;
document.head.appendChild(style);

