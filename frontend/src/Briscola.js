import Hand from './Hand';
import Card from './Card';

const playerHand = [
  { id: 1, rank: "A", suit: "Spadess" },
  { id: 2, rank: "B", suit: "Spadess" },
  { id: 3, rank: "A", suit: "Spadess" },    
];

const enemyHand = [
{ id: 1, scale: 1.1},
{ id: 2, scale: 1.1},
{ id: 3, scale: 1.1},
];


function Board({}){
    return(
      <div className="Board h-1/5 flex relative justify-center right-1/4 ">
        <div className='h-full  z-20'><Card scale={1.1}/></div>
        <div className='absolute h-full right-[-20px] bottom-[-50px] rotate-[35deg] z-10 '><Card/></div>
      </div>

    )
}

export default function Briscola(){

    
  return(
  <div className="Outside relative flex justify-start items-start min-h-screen">
  {/* Left Bar */}
  <div className="leftBar absolute left-0 bg-[#cdffcd] w-[10rem] h-full m-2 p-2 border-[5px] border-solid border-[black]"></div>

  
  {/* Gameboard Container */}
  <div
    className="gameboard-container min-w-[600px] flex justify-center mt-[10px] ml-[11rem] items-center w-full h-full"
    style={{
      width: '90vw', // Ensure both width and height are calculated the same way
      height: '90vh'
    }}>
    {/* Gameboard */}
    <div
      className="Gameboard gameboard-square relative flex flex-col items-center justify-between  bg-green-600 border-[5px] border-black"
      style={{
        width: '100%',  // Gameboard takes up 100% of the container width
        height: '100%', // Gameboard takes up 100% of the container height
      }}>
      <div className="Enemyhand h-1/5 w-full flex justify-center ">
        <Hand Hand={enemyHand} />
      </div>
      <Board />
      <div className="Playerhand h-1/5 w-full flex  justify-center">
        <Hand Hand={playerHand} />
      </div>
    </div>
  </div>
  {/* Right Bar */}
  <div className="rightBar  right-0 bg-[#cdffcd] w-[10rem] h-[300px] m-2 p-2 border-[5px] border-solid border-[black]"></div>

</div>






    
    )
};

