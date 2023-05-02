
// constants 
const SYMBOL = {
    '0': '',
    '1': '&#10060;',
    '-1': '&#x2b55;',
}

// state variables
let board;
let turn;
let winner;
let turnCount;

// cached elements
const title = document.querySelector('header');
const msgEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const gridEls = document.querySelectorAll('#board > div');

// event listeners
document.querySelector('button').addEventListener('click', init);

// functions



function handleClick(evt){
    const cell = evt.target;
    // guard to check the board or already clicked squares have been clicked.
    if (cell.classList.contains('center') || cell.id === 'board') return;
    // below gets the coordinates of the click gridspace by using the element ID - which needs to be changed from a string to a number.
    colIdx = Number(cell.id[1]);
    rowIdx = Number(cell.id[3]);
    // guard to check playable square
    if (board[colIdx][rowIdx] !== 0) return;
    board[colIdx][rowIdx] = turn;
    turn *= -1;

    winner = getWinner(colIdx, rowIdx);
    if (winner === null && turnCount === 8){ // checks if there is no winner and no board space left to call it for a tie.
        winner = 'T';
        render();
    }
    else{
        turnCount++;
        render();
    }
    
}

function getWinner(colIdx, rowIdx){
    return checkVerticalWin(colIdx, rowIdx) || 
    checkHorizontalWin(colIdx, rowIdx) ||
    checkNeswWin(colIdx, rowIdx) ||
    checkNwseWin(colIdx, rowIdx);

}

function checkVerticalWin(colIdx, rowIdx){
    const adjCountUp = countdAjacent(colIdx, rowIdx, 0,1);
    const adjCountDown = countdAjacent(colIdx, rowIdx, 0,1);
    return adjCountUp+adjCountDown >= 3 ? board[colIdx][rowIdx] : null;
}

function checkHorizontalWin(colIdx, rowIdx){
    const adjCountLeft = countdAjacent(colIdx, rowIdx, -1,0);
    const adjCountRight = countdAjacent(colIdx, rowIdx, 1,0);
    return adjCountLeft+adjCountRight >= 2 ? board[colIdx][rowIdx] : null;
}

function checkNeswWin(colIdx, rowIdx){
    const adjCountLeft = countdAjacent(colIdx, rowIdx, -1,-1);
    const adjCountRight = countdAjacent(colIdx, rowIdx, 1,1);
    return adjCountLeft+adjCountRight >= 2 ? board[colIdx][rowIdx] : null;
}

function checkNwseWin(colIdx, rowIdx){
    const adjCountLeft = countdAjacent(colIdx, rowIdx, -1,1);
    const adjCountRight = countdAjacent(colIdx, rowIdx, 1,-1);
    return adjCountLeft+adjCountRight >= 2 ? board[colIdx][rowIdx] : null;

}

function countdAjacent(colIdx, rowIdx, colDelta, rowDelta){
    //shortcut variable to player value
    const player = board[colIdx][rowIdx];
    let count = 0;
    colIdx += colDelta;
    rowIdx += rowDelta;

    while(
        // ensure colIdx is inbounds of the board array
        board[colIdx] !== undefined &&
        board[colIdx][rowIdx] !== undefined &&
        board[colIdx][rowIdx] === player){
            count++;
            colIdx += colDelta;
            rowIdx += rowDelta;
    }
    return count;
}

function init(){
    document.getElementById('board').addEventListener('click', handleClick); // initialises the event listener for clicks on the board

    board = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]; // sets up blank board

    turn = 1;
    turnCount = 0; // turnCount is used to find out whether we have reached a draw state
    winner = null;
    render();
    
}

function render(){
    renderBoard();
    renderMessage();
    renderControls();

}

function renderBoard(){

    board.forEach(function(colArr, colIdx){

        colArr.forEach(function(cell,rowIdx){

            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            // below creates a span element holding the player sybmol
            cellEl.innerHTML =  '<span class = "center">' + SYMBOL[cell] + "</span>";
            cellEl.style.display = 'flex';
            cellEl.style.justifyContent = 'center';
            cellEl.style.fontSize = '6vmin';
            

        });
    });

}

function renderMessage(){
    title.innerText = "Tic Tac Toe"
    if (winner === 'T'){
        msgEl.innerText = 'IT\'s a TIE!';

    } else if(winner) {
        msgEl.innerHTML = `<span> ${SYMBOL[winner]}</span> WINS!`;
        document.getElementById('board').removeEventListener('click', handleClick); // this removes the event listener from the board so that the user can not carry on playing after there us a win state.

    } else {
        msgEl.innerHTML = `<span> ${SYMBOL[turn]}'s</span> TURN`;

    }
}
function renderControls(){

    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
    // shows play again button if game has come to an end 
   
    
    
}

init();