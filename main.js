
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
    colIdx = Number(cell.id[1]);
    rowIdx = Number(cell.id[3]);
    // guard to check playable square
    if (board[colIdx][rowIdx] !== 0) return;
    board[colIdx][rowIdx] = turn;
    turn *= -1;
    
    
    
    winner = getWinner(colIdx, rowIdx);
    if (winner === null && turnCount === 8){
        winner = 'T';
        render();
    }
    else{
        turnCount++;
        render();
    }
    
    
    //console.log('before parsing', colIdx, rowIdx);
    
    

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
    //console.log('vertical win count', adjCountDown+adjCountUp);
    return adjCountUp+adjCountDown >= 3 ? board[colIdx][rowIdx] : null;
}

function checkHorizontalWin(colIdx, rowIdx){
    const adjCountLeft = countdAjacent(colIdx, rowIdx, -1,0);
    const adjCountRight = countdAjacent(colIdx, rowIdx, 1,0);
    //console.log('horizontal win count ', adjCountLeft+adjCountRight);
    return adjCountLeft+adjCountRight >= 2 ? board[colIdx][rowIdx] : null;
}

function checkNeswWin(colIdx, rowIdx){
    const adjCountLeft = countdAjacent(colIdx, rowIdx, -1,-1);
    const adjCountRight = countdAjacent(colIdx, rowIdx, 1,1);
    //console.log('nesw win count ', adjCountLeft+adjCountRight);
    return adjCountLeft+adjCountRight >= 2 ? board[colIdx][rowIdx] : null;
}

function checkNwseWin(colIdx, rowIdx){
    const adjCountLeft = countdAjacent(colIdx, rowIdx, -1,1);
    const adjCountRight = countdAjacent(colIdx, rowIdx, 1,-1);
    //console.log('nwse win count ', adjCountLeft+adjCountRight);
    return adjCountLeft+adjCountRight >= 2 ? board[colIdx][rowIdx] : null;

}

function countdAjacent(colIdx, rowIdx, colDelta, rowDelta){
    //shortcut variable to player value
    const player = board[colIdx][rowIdx];
    //console.log('player', player);
    // track count of adjacent cells with the same player value
    let count = 0;
    //console.log(board[colIdx][rowIdx]);
    //initialise the new coordinates
    colIdx += colDelta;
    rowIdx += rowDelta;
    //console.log('colIdx, rowIdx: ', colIdx, rowIdx);
    while(
        // ensure colIdx is inbounds of the board array
        board[colIdx] !== undefined &&
        board[colIdx][rowIdx] !== undefined &&
        board[colIdx][rowIdx] === player){
            //console.log('gets here count:', count)
            count++;
            colIdx += colDelta;
            rowIdx += rowDelta;
    }
    return count;
}

function init(){
    document.getElementById('board').addEventListener('click', handleClick);

    board = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    turn = 1;
    turnCount = 0;
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
            //console.log(cellId, cellEl);
            
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

        msgEl.innerText = 'IT\'s TIE!';

    } else if(winner) {
        msgEl.innerHTML = `<span style="Color: ${SYMBOL[winner]}"> ${SYMBOL[winner].toUpperCase()}</span> WINS!`;
        document.getElementById('board').removeEventListener('click', handleClick);

    } else {
        msgEl.innerHTML = `<span style="Color: ${SYMBOL[turn]}"> ${SYMBOL[turn].toUpperCase()}'s</span> TURN`;

    }
}
function renderControls(){

    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
    
    // iterate over the marker elements to either hide or show according to the column being full or not
    
    
}

init();