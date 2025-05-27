import './App.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';

function Square({ location, value, onSquareClick, winner }) {

  return (
    <button 
      className='square' 
      onClick={ onSquareClick } 
      style={{
        background: (location === winner.squares[0] || location === winner.squares[1] || location === winner.squares[2]) ? 'yellow' : 'white',
      }} 
    >
      { value }
    </button>
  );
}

function Board({ dimensions, xIsNext, squares, onPlay }) {

  const winner = calculateWinner( squares );

  function handleClick( i, coordinates ) {

    const winner = calculateWinner( squares );
    if ( winner.winner || squares[i] ) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[nextSquares.length - 1] = coordinates;

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    onPlay( nextSquares );

  }

  function createBoard() {

    const board = [];

    for (let y = 0; y < dimensions.rows; y++) {

      const row = [];

      for (let x = 0; x < dimensions.columns; x++) {

        row.push(<Square key={ x } location={ (dimensions.rows * y) + x } value={ squares[ (dimensions.rows * y) + x ] } onSquareClick={ () => handleClick( (dimensions.rows * y) + x, {x: x + 1, y: y + 1} ) } winner={ winner } />)

      }

      board.push(<div key={ y } className='board-row'>{ row }</div>);

    }

    return board;

  }

  return ( 
    <div className='board-container'>
      { createBoard() }
    </div>
  );
}

function Game() {

  const dimensions = {rows: 3, columns: 3};
  const [ history, setHistory ] = useState([ Array((dimensions.rows * dimensions.columns) + 1).fill(null) ]);
  const [ currentMove, setCurrentMove ] = useState(0);
  const [ isAscending, setIsAscending ] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[ currentMove ];

  function handlePlay( nextSquares ) {

    const nextHistory = [ ...history.slice( 0, currentMove + 1 ), nextSquares ];
    setHistory( nextHistory );
    setCurrentMove( nextHistory.length - 1 );

  }

  function jumpTo( move ) {

    setCurrentMove( move );

  }

  function sortMoves() {
    
    setIsAscending( !isAscending );

  }

  const moves = history.map(( squares, move ) => {

    const winner = calculateWinner( squares );
    let description;
    if (move === currentMove) {

      if (move === 0) {
        description = 'You are at game start.';
      } else if (winner.winner) {
        description = 'You are at game end. ' + winner.winner + ' has won.';
      } else if (move === (dimensions.rows * dimensions.columns)) {
        description = 'You are at game end. It is a Tie.';
      } else {
        description = 'You are at move #' + move + '.';
      }

    } else {

      if (move === 0) {
        description = 'Go to game start.';
      } else if (winner.winner) {
        description = 'Go to game end. ' + winner.winner + ' has won.';
      } else if (move === (dimensions.rows * dimensions.columns)) {
        description = 'Go to game end. It is a Tie.';
      } else {
        description = 'Go to move #' + move + '.';
      }

    }

    if (move !== 0) {
      description = description + ' ' + (move % 2 === 0 ? 'O' : 'X') + ' on coordinate: (' + squares[squares.length - 1].y + ', ' + squares[squares.length - 1].x + ')';
    }

    return (
      <li key={ move }>
        <button onClick={ () => jumpTo( move ) } disabled={ move === currentMove }>{ description }</button>
      </li>
    );
  }).sort(() => isAscending ? -1 : 1 );

  const winner = calculateWinner( currentSquares );
  let status;

  if (winner.winner) {
    status = 'This winner is ' + winner.winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');

    if ((moves.length - 1) === (dimensions.rows * dimensions.columns)) {
      status = 'No one wins. It is a Tie';
    }
  }

  return (
    <div className='game-container'>
      <div className='status-container'>
        <div className='status-title'>{ status }</div>
        <Board dimensions={ dimensions } xIsNext={ xIsNext } squares={ currentSquares } onPlay={ handlePlay } />
      </div>
      <div className='game-info'>
        <div className='info-container'>
          <div className='info-title'>Game History</div>
          <button onClick={ sortMoves }>
            { isAscending ? 
            <FontAwesomeIcon icon={faSortUp} /> : 
            <FontAwesomeIcon icon={faSortDown} /> }
          </button>
        </div>
        <ol reversed={ isAscending }>{ moves }</ol>
      </div>
    </div>
  );
}

function App() {

  return (
    <div className='app-container'>
      <Game />
    </div>
  );
}

export default App;

function calculateWinner( squares ) {
  
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winningLines.length; i++) {

    const [a, b, c] = winningLines[i];
    if ( squares[a] && (squares[a] === squares[b]) && (squares[a] === squares[c]) ) {
      return {winner: squares[a], squares: [a, b, c]};
    }

  }

  return {winner: null, squares: Array(3).fill(undefined)};
}