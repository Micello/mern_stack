

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
          transform: `rotate(${angle}rad) translateY(${height * 10}px) translateX(${angle * -400}px)`,
        }}
        className={`   max-w-[100px] aspect-[55/94] relative focus:ring-violet-300 active:bg-violet-700 bg-[lightgrey] hover:bg-gray-50  box-border   border-2 border-solid border-[black] transition-transform duration-300 ease-in-out`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {rank ? id + ' ' + rank + ' ' + suit : id +  rank + 'altezza  :' + height + 'angolo:  ' + angle}
      </div>
    );
  }


function EnemyHand({ enemyCards }) {
return (
    <ul className="h-2/3 flex justify-center items-center  ">
    {enemyCards.map((i) => {
        const angle = 0.06*(i - ((enemyCards.length+1)/2))
        const height = 0.5*(i - (enemyCards.length+1)/2)*(i-(enemyCards.length+1)/2)
        return (
        <li className='aspect-[55/94] h-full'key={i}>
            <Card id={i} angle={angle} height={height} scale={1.1} />
        </li>
        );
    })}
    </ul>
);
}

  function Hand({ playerHand }) {
    return (
      <ul className="flex justify-center items-center  ">
        {playerHand.map((card) => {
            const angle = 0.06*(card.id - ((playerHand.length+1)/2))
            const height = 0.5*(card.id - (playerHand.length+1)/2)*(card.id-(playerHand.length+1)/2)
            return (
            <li key={card.id}>
              <Card id={card.id} rank={card.rank} suit={card.suit} angle={angle} height={height} />
            </li>
          );
        })}
      </ul>
    );
  }

function Board({}){
    return(
        <div className={'Board flex justify-center items-center '}>
            <Card  scale={1.1}/>
        </div>
    )
}

export default function Briscola(){

    
    return(
        <div className="flex flex-grow justify-start h-full w-full">
            <div className="leftBar flex-shrink-0 bg-[#cdffcd] w-[300px] h-[600px] m-2 p-2 border-[5px] border-solid border-[black]">

            </div>
            <div className={' aspect-square flex flex-grow flex-col items-center justify-start  '}>
                <div className='w-flex w-full flex-grow flex-col items-center '>
                    <p>mano p2</p>
                    <EnemyHand enemyCards={enemyCards}/>
                </div>
                
                <Board />
                
                <div className='flex w-full flex-grow flex-col items-center'>
                    <p>mano p1</p>
                    <Hand playerHand={playerHand}/>
                </div>        
            </div>
            <div className="leftBar flex-shrink-0 bg-[#cdffcd] w-[300px] h-[600px] m-2 p-2 border-[5px] border-solid border-[black]">

            </div>
        </div>
    )
};

const playerHand = [
    { id: 1, rank: "A", suit: "Spades" },
    { id: 2, rank: "10", suit: "Hearts" },
    { id: 3, rank: "3", suit: "Clubs" },
    { id: 4, rank: "K", suit: "Clubs" },
    { id: 5, rank: "K", suit: "Clubs" },
    { id: 6, rank: "K", suit: "Clubs" }

    
];

const enemyCards = [1,2,3,4,5,6,7]