let player1 = 0;
let tie = 0;
let player2 = 0;
let computer = 0;
let starter = "player1";
let first = document.querySelector(".first");
let second = document.querySelector(".second");
let third = document.querySelector(".third");
let fourth = document.querySelector(".fourth");
let fifth = document.querySelector(".fifth");
let sixth = document.querySelector(".sixth");
let seventh = document.querySelector(".seventh");
let eight = document.querySelector(".eight");
let ninth = document.querySelector(".ninth");

let person_or_computer = document.querySelector(".player_2")
let player1_score = document.querySelector(".player1_score");
player1_score.innerHTML = player1;

let Tie = document.querySelector(".tie");
Tie.innerHTML = tie;

let player2_score = document.querySelector(".player2_score");
player2_score.innerHTML = player2;
let computer_score = document.querySelector(".comupter_score");

let select_player2 = document.querySelector(".switch");
select_player2.addEventListener("click", function () {
  select_player2.classList.toggle("computer");
  const isComputer = select_player2.classList.contains("computer");
  person_or_computer.innerHTML = isComputer ? "COMPUTER(O)" : "PLAYER2(O)";

  // Reset scores & board
  player1 = player2 = computer = tie = 0;
  player1_score.innerHTML = player1;
  player2_score.innerHTML = player2;
  computer_score.innerHTML = computer;
  Tie.innerHTML = tie;
  reset();
});

let btns = document.querySelectorAll(".btn");
btns.forEach(function (el) {
    el.addEventListener("click", function () {
        console.log("btn selected");
        console.log(el.classList);
        if (starter === "player1") {
            el.classList.add("x");
            el.innerHTML = "X";
            check();
            if (select_player2.classList.contains("computer")) {
                starter = "computer";
            }
            else {
                starter = "player2";
            }
        }
        else {
            el.classList.add("o");
            el.innerHTML = "O";
            check();
            starter = "player1";
        }

    });
});
function reset(){
btns.forEach(function(el){
    el.innerHTML = "";
     el.classList.remove("x", "o");
})
}
function check() {
    if ((first.innerHTML ==="X" && second.innerHTML ==="X" && third.innerHTML === "X") || 
    (first.innerHTML ==="X" && fourth.innerHTML ==="X" && fifth.innerHTML === "X") || 
    (seventh.innerHTML ==="X" && eight.innerHTML ==="X" && ninth.innerHTML === "X") || 
    (third.innerHTML ==="X" && sixth.innerHTML ==="X" && ninth.innerHTML === "X") || 
    (first.innerHTML ==="X" && fifth.innerHTML ==="X" && ninth.innerHTML === "X") || 
    (seventh.innerHTML ==="X" && fifth.innerHTML ==="X" && third.innerHTML === "X") || 
    (fifth.innerHTML ==="X" && second.innerHTML ==="X" && eight.innerHTML === "X") || 
    (fourth.innerHTML ==="X" && fifth.innerHTML ==="X" && sixth.innerHTML === "X")){
        player1++;
    player1_score.innerHTML = player1;
    setTimeout(reset() , 1000);
    //  reset();
    starter = select_player2.classList.contains("computer") ? "computer" : "player2";
            return;
           
    }
    else if ((first.innerHTML ==="O" && second.innerHTML ==="O" && third.innerHTML ==="O") || 
    (first.innerHTML ==="O" && fourth.innerHTML ==="O" && fifth.innerHTML === "O") || 
    (seventh.innerHTML ==="O" && eight.innerHTML ==="O" && ninth.innerHTML === "O") || 
    (third.innerHTML ==="O" && sixth.innerHTML ==="O" && ninth.innerHTML === "O") || 
    (first.innerHTML ==="O" && fifth.innerHTML ==="O" && ninth.innerHTML === "O") || 
    (seventh.innerHTML ==="O" && fifth.innerHTML ==="O" && third.innerHTML === "O") || 
    (fifth.innerHTML ==="O" && second.innerHTML ==="O" && eight.innerHTML === "O") || 
    (fourth.innerHTML ==="O" && fifth.innerHTML ==="O" && sixth.innerHTML === "O")){
    
    player2++;
    player2_score.innerHTML = player2;
    reset();
    starter = "player1";
    return;
    }
    else{

        // tie++;
        // Tie.innerHTML = tie;
        // reset();
}
}



// Board array to mirror UI and simplify checks
let board = ["", "", "", "", "", "", "", "", ""];

// Winning combinations lookup
const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Update board state when a button is clicked
btns.forEach((el, idx) => {
  el.addEventListener('click', () => {
    if (board[idx] || checkBoardTerminal()) return; // ignore if occupied or game ended

    // Human (X) plays
    starter = "player1";
    board[idx] = "X";
    el.classList.add("x");
    el.innerHTML = "X";
    checkGame();

    // If playing against computer and game not ended, let AI move
    if (select_player2.classList.contains("computer") && !checkBoardTerminal()) {
      const aiIdx = findBestMove(board);
      const aiBtn = btns[aiIdx];
      board[aiIdx] = "O";
      aiBtn.classList.add("o");
      aiBtn.innerHTML = "O";
      starter = "player1";
      checkGame();
    }
  });
});

// Check game state: win, lose, or tie
function checkGame() {
  const winX = checkWinnerOnBoard("X");
  const winO = checkWinnerOnBoard("O");
  const full = board.every(c => c !== "");

  if (winX) {
    player1++;
    player1_score.innerHTML = player1;
    setTimeout(() => reset(), 500);
  } else if (winO) {
    if (select_player2.classList.contains("computer")) {
      computer++;
      computer_score.innerHTML = computer;
    } else {
      player2++;
      player2_score.innerHTML = player2;
    }
    setTimeout(() => reset(), 500);
  } else if (!winX && !winO && full) {
    tie++;
    Tie.innerHTML = tie;
    setTimeout(() => reset(), 500);
  }
}

// Check winner helper
function checkWinnerOnBoard(sym) {
  return winCombos.some(combo =>
    combo.every(i => board[i] === sym)
  );
}

// Detect if game over: win or tie
function checkBoardTerminal() {
  return checkWinnerOnBoard("X") ||
         checkWinnerOnBoard("O") ||
         board.every(c => c !== "");
}

// Reset UI and board array
function reset() {
  board = ["", "", "", "", "", "", "", "", ""];
  btns.forEach(el => {
    el.innerHTML = "";
    el.classList.remove("x", "o");
  });
}

// --- Minimax algorithm to pick best AI move (O is maximizing) ---
function minimax(brd, player) {
  const winX = checkWinnerOnBoard.call({board: brd}, "X");
  const winO = checkWinnerOnBoard.call({board: brd}, "O");
  const full = brd.every(c => c !== "");
  if (winX) return { score: -10 };
  if (winO) return { score: +10 };
  if (full) return { score: 0 };

  const moves = [];
  brd.forEach((cell, idx) => {
    if (!cell) {
      const move = { index: idx };
      brd[idx] = player;
      const result = minimax(brd, player === "O" ? "X" : "O");
      move.score = result.score;
      brd[idx] = "";
      moves.push(move);
    }
  });

  return player === "O"
    ? moves.reduce((best, m) => m.score > best.score ? m : best, {score: -Infinity})
    : moves.reduce((best, m) => m.score < best.score ? m : best, {score: +Infinity});
}

function findBestMove(brd) {
  const best = minimax([...brd], "O");
  return best.index;
}


