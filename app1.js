const choiceButtons = document.querySelectorAll("[data-choice]");
const playerChoice = document.getElementById("player-choice");
const computerChoice = document.getElementById("computer-choice");
const roundResult = document.getElementById("round-result");
const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");
const drawScore = document.getElementById("draw-score");
const resetGameButton = document.getElementById("reset-game");

const choices = ["rock", "paper", "scissors"];
const storageKey = "app1-rock-paper-scissors-score";
let score = loadScore();

renderScore();

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const playerMove = button.dataset.choice;
    const computerMove = getComputerChoice();
    const result = decideWinner(playerMove, computerMove);

    playerChoice.textContent = formatChoice(playerMove);
    computerChoice.textContent = formatChoice(computerMove);
    roundResult.textContent = result.message;

    if (result.winner === "player") {
      score.player += 1;
    } else if (result.winner === "computer") {
      score.computer += 1;
    } else {
      score.draws += 1;
    }

    saveScore();
    renderScore();
  });
});

resetGameButton.addEventListener("click", () => {
  score = { player: 0, computer: 0, draws: 0 };
  playerChoice.textContent = "-";
  computerChoice.textContent = "-";
  roundResult.textContent = "Make your first move.";
  saveScore();
  renderScore();
});

function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function decideWinner(playerMove, computerMove) {
  if (playerMove === computerMove) {
    return { winner: "draw", message: "It is a draw." };
  }

  const playerWins =
    (playerMove === "rock" && computerMove === "scissors") ||
    (playerMove === "paper" && computerMove === "rock") ||
    (playerMove === "scissors" && computerMove === "paper");

  if (playerWins) {
    return { winner: "player", message: "You win this round." };
  }

  return { winner: "computer", message: "Computer wins this round." };
}

function renderScore() {
  playerScore.textContent = String(score.player);
  computerScore.textContent = String(score.computer);
  drawScore.textContent = String(score.draws);
}

function saveScore() {
  localStorage.setItem(storageKey, JSON.stringify(score));
}

function loadScore() {
  const savedScore = localStorage.getItem(storageKey);
  if (!savedScore) {
    return { player: 0, computer: 0, draws: 0 };
  }

  try {
    const parsedScore = JSON.parse(savedScore);
    return {
      player: Number(parsedScore.player) || 0,
      computer: Number(parsedScore.computer) || 0,
      draws: Number(parsedScore.draws) || 0
    };
  } catch {
    return { player: 0, computer: 0, draws: 0 };
  }
}

function formatChoice(choice) {
  return choice.charAt(0).toUpperCase() + choice.slice(1);
}
