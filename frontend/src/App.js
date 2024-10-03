import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  
  let status;
  const winner= calculateWinner(squares);
  
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  
  function handleClick(i) {
    if (!squares[i] && !calculateWinner(squares)){
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      onPlay(nextSquares);
    
    }

  }

  
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game(){
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove]; // -> prop cambiato (più avanti in render), Board si rerenderizza
  
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);                 //-> Il componente Game si rerenderizza
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);             //-> Il componente Game si rerenderizza
    setXIsNext(nextMove%2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return(
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
    <div className="game-info">
      <ol>{moves}</ol>
    </div>
  </div>
  );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/*
Il componente Game ha lo stato history (l'insieme degli squares fino ad ora) e xIsNext.
Il componente Board riceve i prop xIsNext, squares e onPlay da Game e renderizza 9 Square.
Ogni Square è cliccabile e trigghera handleClick all'interno di Board.

Quando clichi su uno Square:
onSquareClick chiama handleclick nella componenete Board.
handleClick(i) crea il nuovo squares e chiama onPlay(nextSquares) che permette di chiamare handlePlay di Game e passare il nuovo squares.

la funzione handlePlay viene eseguita in Game e:
 -aggiorna history fino alla mossa corrente con la nuova mossa nextSquares, assicurandosi che se un player salta a una mossa precedente, ogni mossa futura venga scartata.
 -aggiorna la mossa corrente e il booleano del turno.
 
  Siccome setHistory, setCurrentMove, setXIsNext sono tutte state chiamate, Game si rerenderizza, il quale dichiarerà currentSquares e verrà passato come prop squares al componente Board (in return),
  proccando il rerender di Board, il quale oltre a calcolare il vincitore a sua volta procca il re render di tutti gli Square, con ogni Square che riceve il valore aggiornato di currentSquares.


 Quando clicco un pulsante di salto l'evento onClick viene chiamato e trigghera jumpTo(mossa a cui voglio tornare) di Game.
 La funzione jumpTo aggiorna currentMove, rerenderizzando Game e quindi mostrando nell'app la board nella mossa currentMove.
 currentSquares viene quindi ricalcolato in base a history[currentMove]. Quando return verrà eseguito squares={currentSquares}
  ri renderizza Board che calcola il vincitore e di conseguenza gli Square
  */