document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome");
  const gameScreen = document.querySelector(".main-bg");
  const playerForm = document.getElementById("playerForm");
  const playerXNameDisplay = document.getElementById("player-x-name");
  const playerONameDisplay = document.getElementById("player-o-name");
  const currentPlayerText = document.getElementById("current-player");
  const board = document.getElementById("board");
  const cells = Array.from(document.querySelectorAll(".cell"));
  const statusBanner = document.getElementById("status-banner");
  const resetBtn = document.getElementById("reset");
  const strike = document.getElementById("strike");
  const gifs = {
    leftExcited: document.getElementById("left-excited"),
    rightExcited: document.getElementById("right-excited"),
    leftSad: document.getElementById("left-sad"),
    rightSad: document.getElementById("right-sad"),
  };

  const scoreX = document.getElementById("score-x");
  const scoreO = document.getElementById("score-o");
  const scoreDraw = document.getElementById("score-draw");

  let player1 = "Player X";
  let player2 = "Player O";
  let currentPlayer = "X";
  let gameActive = true;
  let boardState = Array(9).fill("");

  const winCombos = [
    [0, 1, 2, "strike-row-0"],
    [3, 4, 5, "strike-row-1"],
    [6, 7, 8, "strike-row-2"],
    [0, 3, 6, "strike-col-0"],
    [1, 4, 7, "strike-col-1"],
    [2, 5, 8, "strike-col-2"],
    [0, 4, 8, "strike-diag-0"],
    [2, 4, 6, "strike-diag-1"]
  ];

  const scores = { X: 0, O: 0, draw: 0 };

  playerForm.addEventListener("submit", e => {
    e.preventDefault();
    player1 = document.getElementById("player1").value.trim() || "Player X";
    player2 = document.getElementById("player2").value.trim() || "Player O";
    playerXNameDisplay.textContent = player1;
    playerONameDisplay.textContent = player2;
    updateTurnText();
    welcomeScreen.style.display = "none";
    gameScreen.style.display = "flex";
  });

  function updateTurnText() {
    currentPlayerText.textContent = `${currentPlayer === "X" ? player1 : player2}'s turn (${currentPlayer})`;
    currentPlayerText.classList.add("pulse");
    setTimeout(() => currentPlayerText.classList.remove("pulse"), 1000);
  }

  function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (!gameActive || boardState[index]) return;

    boardState[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add(currentPlayer.toLowerCase());

    const winner = checkWinner();
    if (winner) {
      gameActive = false;
      highlightWinner(winner.combo);
      updateScore(winner.player);
      showStatus(`${winner.player === "X" ? player1 : player2} Wins!`, "#388e3c");
      playGIF(winner.player);
    } else if (boardState.every(cell => cell)) {
      scores.draw++;
      scoreDraw.textContent = scores.draw;
      gameActive = false;
      showStatus("It's a Draw!", "#757575");
      playGIF("draw");
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      updateTurnText();
    }
  }

  function checkWinner() {
    for (let [a, b, c, combo] of winCombos) {
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        return { player: boardState[a], combo };
      }
    }
    return null;
  }


  function highlightWinner(comboClass) {
    strike.className = "";
  
    const combo = winCombos.find(w => w[3] === comboClass);
    if (!combo) return;
  
    const [a, , c] = combo;
    const rectA = cells[a].getBoundingClientRect();
    const rectC = cells[c].getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
  
    const x1 = rectA.left + rectA.width / 2;
    const y1 = rectA.top + rectA.height / 2;
    const x2 = rectC.left + rectC.width / 2;
    const y2 = rectC.top + rectC.height / 2;
  
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const length = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
    strike.style.display = "block";
    strike.style.width = `${length}px`;
    strike.style.height = `6px`;
    strike.style.left = `${x1 - boardRect.left}px`;
    strike.style.top = `${y1 - boardRect.top}px`;
    strike.style.transform = `rotate(${angle}deg)`;
    strike.style.transformOrigin = "0 0";
  
    combo.slice(0, 3).forEach(i => cells[i].classList.add("win"));
  }
  

  function updateScore(winner) {
    scores[winner]++;
    if (winner === "X") {
      scoreX.textContent = scores.X;
    } else {
      scoreO.textContent = scores.O;
    }
  }

  function showStatus(message, color) {
    statusBanner.textContent = message;
    statusBanner.style.background = color;
    statusBanner.style.display = "block";
  }

  function playGIF(winner) {
    // Hide all first
    Object.values(gifs).forEach(g => {
      g.style.display = "none";
    });

    if (winner === "X") {
      gifs.leftExcited.style.display = "block";
      gifs.rightSad.style.display = "block";
    } else if (winner === "O") {
      gifs.rightExcited.style.display = "block";
      gifs.leftSad.style.display = "block";
    } else {
      gifs.leftSad.style.display = "block";
      gifs.rightSad.style.display = "block";
    }
  }

  function resetGame() {
    boardState.fill("");
    cells.forEach(cell => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "win");
    });
    strike.style.display = "none";
    statusBanner.style.display = "none";
    Object.values(gifs).forEach(g => g.style.display = "none");
    currentPlayer = "X";
    gameActive = true;
    updateTurnText();
  }

  cells.forEach(cell => cell.addEventListener("click", handleCellClick));
  resetBtn.addEventListener("click", resetGame);
});
