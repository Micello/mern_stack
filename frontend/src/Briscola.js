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
{ id: 4, scale: 1.1},
{ id: 5, scale: 1.1},
];


function Board({}){
    return(

      


<div className="h-full w-full grid grid-cols-5 grid-rows-6 gap-4">
    <div className="row-span-2 col-start-3 row-start-2 flex justify-center"><Slot /></div>
    <div className="row-span-2 col-start-3 row-start-4 flex justify-center"><Slot /></div>
    <div className="relative row-span-2 col-start-2 row-start-3 flex justify-end z-20">
      <div className="h-full aspect-[55/88] z-20"><Card  /></div>
      <div className="h-full aspect-[55/88] absolute rotate-[35deg] right-[-50px] z-10"><Card rank={"spades"} /></div>
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

