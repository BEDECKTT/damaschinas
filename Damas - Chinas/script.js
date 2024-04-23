// FUNCIONAMIENTO DEL CRONOMETRO 

const stopwatch = document.getElementById('stopwatch');
const playPauseButton = document.getElementById('play-pause');
const secondsSphere = document.getElementById('seconds-sphere');

let stopwatchInterval;
let runningTime = 0;

const playPause = () => {
    const isPaused = !playPauseButton.classList.contains('running');
    if (isPaused) {
        playPauseButton.classList.add('running');
        start();
    } else {
        playPauseButton.classList.remove('running');
        pause();
    }
}

const pause = () => {
    secondsSphere.style.animationPlayState = 'paused';
    clearInterval(stopwatchInterval);
}

const stop = () => {
    secondsSphere.style.transform = 'rotate(-90deg) translateX(60px)';
    secondsSphere.style.animation = 'none';
    playPauseButton.classList.remove('running');
    runningTime = 0;
    clearInterval(stopwatchInterval);
    stopwatch.textContent = '00:00';
}

const start = () => {
    secondsSphere.style.animation = 'rotacion 60s linear infinite';
    let startTime = Date.now() - runningTime;
    secondsSphere.style.animationPlayState = 'running';
    stopwatchInterval = setInterval( () => {
        runningTime = Date.now() - startTime;
        stopwatch.textContent = calculateTime(runningTime);
    }, 1000)
}

const calculateTime = runningTime => {
    const total_seconds = Math.floor(runningTime / 1000);
    const total_minutes = Math.floor(total_seconds / 60);

    const display_seconds = (total_seconds % 60).toString().padStart(2, "0");
    const display_minutes = total_minutes.toString().padStart(2, "0");

    return `${display_minutes}:${display_seconds}`
}


const BOARD_SIZE = 8;
const GREEN = 1; //primer jugador
const ORANGE = 2; //segundo jugador
let currentPlayer = GREEN; // JUGADOR QUE INICIA EL JUEGO

let board = [];

for (let i = 0; i < BOARD_SIZE; ++i) {
    board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
        // Alterna las celdas
        if ((i + j) % 2 === 0) {
            board[i][j] = 0; // Celda blanca
        } else {
            // Fichas iniciales
            if (i < 3) {
                board[i][j] = ORANGE; // Ficha naranja
            } else if (i >= BOARD_SIZE - 3) {
                board[i][j] = GREEN; // Ficha verde
            } else {
                board[i][j] = 0; // Celda vacía
            }
        }
    }
}

// Definir variables globales
let selectedCell = null;
let originCell = null;

// Función para dibujar el tablero
function drawBoard() {
    const boardElement = document.querySelector(".board");
    boardElement.innerHTML = ""; // Limpiar el tablero

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = i;
            cell.dataset.col = j;

            // Alternar entre celdas blancas y negras
            if ((i + j) % 2 === 0) {
                cell.classList.add("white");
            } else {
                cell.classList.add("black");
            }

            // Si hay una ficha, dibujarla
            if (board[i][j] !== 0) {
                const piece = document.createElement("div");
                piece.className = "piece " + (board[i][j] === GREEN ? "green-piece" : "orange-piece");
                cell.appendChild(piece);
            }

            boardElement.appendChild(cell);
        }
    }
}

//funcion para validar los movimientos
function isValidMove(selectedRow, selectedCol, newRow, newCol) {
    // Verifica si la celda está en el destino
    if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) 
    {
        console.log("Destino fuera del tablero.");
        return false;
    }

    // Verifica si la celda está vacía
    if (board[newRow][newCol] !== 0) 
    {
        console.log("La celda de destino no esta vacia");
        
    }
   
    // Verifica si el movimiento es diagonal y hacia adelante
    const rowDiff = newRow - selectedRow;
    const colDiff = newCol - selectedCol;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);

    if (absRowDiff === 1  && absColDiff === 1) 
    {
        if (board[selectedRow][selectedCol] === GREEN)  
        {
            console.log("Movimiento hacia arriba y diagonal.");
            return rowDiff < 0;
        }
        else if (board[selectedRow][selectedCol] === ORANGE)
        {
            console.log("Movimiento hacia abajo y diagonal.");
            return rowDiff > 0;
        }
    }

   
    // Movimiento diagonal y hacia adelante para eliminar una ficha
    if (absRowDiff === 2 && absColDiff === 2) {

        // Ficha verde (movimiento hacia arriba)
        if (board[selectedRow][selectedCol] === GREEN) 
        {
            const jumpedRow = (selectedRow + newRow) / 2;
            const jumpedCol = (selectedCol + newCol) / 2;
            //verifica si hay una ficha de intermedio
            if (board[jumpedRow][jumpedCol] === ORANGE)
            {
                console.log("Movimiento diagonal y hacia arriba para eliminar una ficha.");
                return true;
            }
        }
        // Ficha naranja (movimiento hacia abajo)
        else if (board[selectedRow][selectedCol] === ORANGE) {
            const jumpedRow = (selectedRow + newRow) / 2;
            const jumpedCol = (selectedCol + newCol) / 2;
            //Verificar que haya una ficha de intermedio
            if (board[jumpedRow][jumpedCol] === GREEN)
            {
                console.log("Movimiento diagonal y hacia abajo para eliminar una ficha.");
                return true;
            }
        }
    }


}

//Funcion para cambiar de jugadores
function switchPlayer() {

    currentPlayer = (currentPlayer === GREEN) ? ORANGE : GREEN; 
    
}

//Funcion para eliminar una ficha
function performMove(selectedRow, selectedCol, newRow, newCol){

    console.log("Inicio de perfermMove");
    console.log("selectedRow:", selectedRow, "selectedCol:", selectedCol);
    console.log("newRow:", newRow, "newCol:", newCol);
    //valida el movimiento
    if (!isValidMove(selectedRow, selectedCol, newRow, newCol))
    {
        console.log("Movimiento no valido");
        return;
    }

    //Verificar si se puede hacer una eliminacion de ficha
    const jumpedRow = (selectedRow + newRow) / 2;
    const jumpedCol = (selectedCol + newCol) / 2;

    console.log("Fila de ficha a eliminar:", jumpedRow, "Columna de ficha a eliminar:", jumpedCol);

    if (board[jumpedRow][jumpedCol] !== currentPlayer && board[jumpedRow][jumpedCol] !== 0)
    {
        board[jumpedRow][jumpedCol] = 0;
        console.log("Has eliminado una ficha enemiga en la fila:", jumpedRow, "columna", jumpedCol);
    }
    else 
    {
        console.log("No se encontro ficha enemiga para eliminar en la fila:", jumpedRow, "columna:", jumpedCol);
    }
    //realiza el movimiento
    board[newRow][newCol] = board[selectedRow][selectedCol];
    board[selectedRow][selectedCol] = 0;

    //actualiza el tablero
    drawBoard();

    //cambia de jugador
    switchPlayer();

}

// Función para mover la ficha
function movePiece(event) {
    const clickedCell = event.target.closest(".cell");

    if (!clickedCell) return; // No se ha pulsado en una celda

    const row = parseInt(clickedCell.dataset.row);
    const col = parseInt(clickedCell.dataset.col);

    if (selectedCell === null) {
        // Si no hay ninguna celda seleccionada, verificar si la celda clickeada tiene una ficha del jugador actual
        if ((currentPlayer === GREEN && board[row][col] !== GREEN) ||
            (currentPlayer === ORANGE && board[row][col] !== ORANGE)) {
            console.log("No puedes mover una ficha de color distinto al tuyo.");
            return;
        }
        // Si es una ficha del jugador actual, la seleccionamos como la celda de origen
        selectedCell = clickedCell;
        highlightCell(selectedCell); // Resaltar la celda seleccionada
    } else {
        // Si ya hay una celda seleccionada, intentamos mover la ficha a la celda clickeada
        const selectedRow = parseInt(selectedCell.dataset.row);
        const selectedCol = parseInt(selectedCell.dataset.col);

        // Validar el movimiento
        const isValid = isValidMove(selectedRow, selectedCol, row, col);

        if (isValid) {
            // Realizar el movimiento
            board[row][col] = board[selectedRow][selectedCol]; // Mover la ficha
            board[selectedRow][selectedCol] = 0; // Vaciar la celda de origen
            drawBoard(); // Redibujar el tablero actualizado

            performMove(selectedRow, selectedCol, row, col); // Agregar el movimiento a la lista de movimientos
        
            // Limpiar la selección de celda
            unhighlightCell(selectedCell);
            selectedCell = null;
        
            // Cambiar al siguiente jugador
            switchPlayer(); // Alterno los jugadores
        } else {
            console.log("El movimiento no es válido.");
        
            // Limpiar la selección de celda y mantener el mismo jugador
            unhighlightCell(selectedCell);
            selectedCell = null;
        }
        
    }
}

//Resalta una celda 
function highlightCell(cell)
{
    cell.style.backgroundColor = "red";

}

//Desresalta una celda
function unhighlightCell(cell)
{
    cell.style.backgroundColor = "";
}


// Llamar a la función para dibujar el tablero al cargar la página
drawBoard();
