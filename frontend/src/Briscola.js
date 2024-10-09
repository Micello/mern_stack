
import asso from './Images/asso.jpg'
import back from './Images/back.jpg'

function Card({ id, rank, suit, angle, height, scale }) {
    const safeAngle = angle || 0; // Default to 0 if angle is undefined
    const safeHeight = height || 0; // Default to 0 if height is undefined
    const safeScale = scale || 1; // Default to 0 if height is undefined
    const handleMouseEnter = rank ? (e) => { e.currentTarget.style.transform = `rotate(${safeAngle}rad) translateY(${safeHeight * 10 - 40}px) translateX(${safeAngle * -400}px)`} : 
        (e) => {//se non ha un seme (non è nella mia mano)
            
            e.currentTarget.style.transform = `scale(${safeScale}) rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -400}px) `};
    
    const handleMouseLeave = rank ? (e) => {
                e.currentTarget.style.transform = `rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -400}px) scale(${safeScale})`
            } :
            (e) => {e.currentTarget.style.transform = `scale(1) rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -400}px) `};
        
  
    return (
      <div
        style={{
          transform: `rotate(${angle}rad) translateY(${height * 10}px) translateX(${angle * -200}px)`,
          width: '', // Ensure both width and height are calculated the same way
          height: '',
          
        }}
        className={`h-full rounded-md  relative focus:ring-violet-300 active:bg-violet-700 bg-[lightgrey] hover:bg-gray-50  box-border   border-2 border-solid border-[black] transition-transform duration-300 ease-in-out`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {rank ? <img src={asso} className=' rounded-md h-full' /> : <img src={back} className='h-full  rounded-md'/>}
      </div>
    );
  }

  function Hand({ Hand }) {
    return (
      <ul className="flex h-full justify-center   ">
        {Hand.map((card) => {
            const angle = 0.06*(card.id - ((Hand.length+1)/2))
            const height = 0.5*(card.id - (Hand.length+1)/2)*(card.id-(Hand.length+1)/2)
            return (
            <li className='h-full' key={card.id}>
              <Card id={card.id} rank={card.rank} suit={card.suit} angle={angle} height={height} />
            </li>
          );
        })}
      </ul>
    );
  }

function Board({}){
    return(
      <div className="Board h-1/5 flex relative justify-center right-1/4 ">
        <div className='h-full  z-20'><Card/></div>
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

const playerHand = [
    { id: 1, rank: "A", suit: "Spadess" },
    { id: 2, rank: "B", suit: "Spadess" },
    { id: 3, rank: "A", suit: "Spadess" },    
];

const enemyHand = [
  { id: 1, rank: "", suit: "Spadess" },
  { id: 2, rank: "", suit: "Spadess" },
  { id: 3, rank: "", suit: "Spadess" },    
];