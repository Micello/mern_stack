import Hand from './Hand';
import Card from './Card';
import {useState } from 'react';
const playerCards = [
  { id: 1, rank: "A", suit: "Spadess" },
  { id: 2, rank: "B", suit: "Spadess" },
  { id: 3, rank: "A", suit: "Spadess" },    
];

const enemyHand = [
{ id: 1, scale: 1.1},
{ id: 2, scale: 1.1},
{ id: 3, scale: 1.1}
];

const boardCards = [
  { id: 0, rank: "slot"},
  { id: 1, rank: "slot"},   
  ];


function Board({briscolaSuit, boardCards}){
  return(

   <div className="h-full w-full grid grid-cols-5 grid-rows-6 gap-4">
        <div className="row-span-2 col-start-3 row-start-2 flex justify-center"><Card rank={boardCards[0].rank} /></div>
        <div className="row-span-2 col-start-3 row-start-4 flex justify-center"><Card rank={boardCards[1].rank}/></div>
        <div className="relative row-span-2 col-start-2 row-start-3 flex justify-end z-20">
          <div className="h-full aspect-[55/88] z-20"><Card  /></div>
          <div className="h-full aspect-[55/88] absolute rotate-[35deg] right-[-50px] z-10"><Card rank={/*briscolaSuit.rank ... */"spades"} /></div>
        </div>
    </div>
    
    )
}

function Slot({}){
  return(
    <div className='h-full aspect-[55/88]'></div>
  )


}




export default function Briscola(){
  const [playerHand, setPlayerHand] = useState(playerCards);
  const [board, setBoard] = useState(boardCards);
  const [opponentHandSize, setOpponentHandSize] = useState(enemyHand);
  const [briscolaSuit, setBriscolaSuit] = useState({ id: 1, rank: "A", suit: "Spadess" });
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [turn, setTurn] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const handleCardClick = (card) => {
    if (turn%2==1) {return}
    console.log("card clicked")
    const newHand = playerHand.filter(c => c.id !== card.id); //card è la carta cliccata
    setPlayerHand(newHand);

    // Add the card to the board (if you want to)
    setBoard((prevBoard) => [
      ...prevBoard, // existing board cards
      { id: card.id, rank: card.rank, suit: card.suit } // newly clicked card
    ]);
  };

  return(
  <div className="Outside relative flex justify-start items-start min-h-screen">
  {/* Left Bar */}
  <div className="leftBar absolute left-0 bg-[#cdffcd] w-[10rem] h-full m-2 p-2 border-[5px] border-solid border-[black]"></div>

  
  {/* Gameboard Container */}
  <div
    className="gameboard-container min-w-[600px] flex justify-center mt-[10px] ml-[11rem] items-center w-full h-full"
    style={{
      width: '100vw', // Ensure both width and height are calculated the same way
      height: '100vh'
    }}>
    {/* Gameboard */}
    <div
      className="Gameboard gameboard-square relative flex flex-col items-center justify-between  bg-green-600 border-[5px] border-black"
      style={{
        width: '100%',  // Gameboard takes up 100% of the container width
        height: '100%', // Gameboard takes up 100% of the container height
      }}>
      <div className="Enemyhand h-1/5 w-full flex justify-between ">
        <Hand Hand={opponentHandSize} playerScore={opponentScore} />
      </div>
      <Board boardCards={board} briscolaSuit={briscolaSuit} />
      <div className="Playerhand h-1/5 w-full flex  justify-between">
        <Hand Hand={playerHand} playerScore={playerScore} onCardClick={handleCardClick} />
      </div>
    </div>
  </div>
  {/* Right Bar */}
  <div className="rightBar  right-0 bg-[#cdffcd] w-[10rem] h-[300px] m-2 p-2 border-[5px] border-solid border-[black]"></div>

</div>






    
    )
};

