
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
        className={`rounded-md  relative focus:ring-violet-300 active:bg-violet-700 bg-[lightgrey] hover:bg-gray-50  box-border   border-2 border-solid border-[black] transition-transform duration-300 ease-in-out`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {rank ? <img src={asso} className=' rounded-md' /> : <img src={back} className='  rounded-md'/>}
      </div>
    );
  }


function EnemyHand({ enemyCards }) {
return (
    <ul className=" flex justify-center ">
    {enemyCards.map((i) => {
        const angle = 0.06*(i - ((enemyCards.length+1)/2))
        const height = 0.5*(i - (enemyCards.length+1)/2)*(i-(enemyCards.length+1)/2)
        return ( //il rateo non corrisponde al front perchè le immagini sono diverse
        <li className='aspect-[55/88]'key={i}>
            <Card id={i} angle={angle} height={height} scale={1.1} />
        </li>
        );
    })}
    </ul>
);
}

  function Hand({ playerHand }) {
    return (
      <ul className="flex justify-center   ">
        {playerHand.map((card) => {
            const angle = 0.06*(card.id - ((playerHand.length+1)/2))
            const height = 0.5*(card.id - (playerHand.length+1)/2)*(card.id-(playerHand.length+1)/2)
            return (
            <li className='aspect-[55/88]' key={card.id}>
              <Card id={card.id} rank={card.rank} suit={card.suit} angle={angle} height={height} />
            </li>
          );
        })}
      </ul>
    );
  }

function Board({}){
    return(
        <div className={'border-black Boardgrid grid gap-10 grid-cols-7'}>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>
            <Card scale={1.1}/>

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
    className="gameboard-container flex justify-center mt-[10px] ml-[11rem] items-center w-full h-full"
    style={{
      width: 'min(90vh, calc(100vw - 20rem))', // Ensure both width and height are calculated the same way
      height: 'min(90vh, calc(100vw - 20rem))',
    }}>
    {/* Gameboard */}
    <div
      className="Gameboard gameboard-square relative flex flex-col items-center justify-between  bg-white border-[5px] border-black"
      style={{
        width: '100%',  // Gameboard takes up 100% of the container width
        height: '100%', // Gameboard takes up 100% of the container height
      }}>
      <div className="Enemyhand h-1/5 w-full flex justify-center ">
        <EnemyHand enemyCards={enemyCards} />
      </div>
      
      <div className="Board h-3/5 flex flex-col justify-center bg-[green] w-full">
        <Board />
      </div>
      <div className="Playerhand h-1/5 w-full flex  justify-center">
        <Hand playerHand={playerHand} />
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
];

const enemyCards = [1,2,3,4]