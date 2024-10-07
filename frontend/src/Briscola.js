

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
        className={`h-full w-full relative focus:ring-violet-300 active:bg-violet-700 bg-[lightgrey] hover:bg-gray-50  box-border   border-2 border-solid border-[black] transition-transform duration-300 ease-in-out`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {rank ? id + ' ' + rank + ' ' + suit : id +  rank + 'altezza  :' + height + 'angolo:  ' + angle}
      </div>
    );
  }


function EnemyHand({ enemyCards }) {
return (
    <ul className="flex justify-center items-center w-full h-full ">
    {enemyCards.map((i) => {
        const angle = 0.06*(i - ((enemyCards.length+1)/2))
        const height = 0.5*(i - (enemyCards.length+1)/2)*(i-(enemyCards.length+1)/2)
        return (
        <li className={'cardli w-full h-full '}key={i}>
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
        {playerHand.map((card,index) => {
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
        <div className={'Board flex justify-center items-center flex-grow flex-shrink'}>
            <Card  scale={1.1}/>
        </div>
    )
}

export default function Briscola(){

    
    return(
        <div className="flex justify-start h-full w-full">
            <div className={' flex flex-col items-center justify-start  '}>
                <div className='flex flex-col items-center h-1/2 w-1/2 '>
                    <p>mano p2</p>
                    <EnemyHand enemyCards={enemyCards}/>
                </div>
                
                    <Board />
                
                <div className='flex flex-col items-center'>
                    <p>mano p1</p>
                    <Hand playerHand={playerHand}/>
                </div>        
            </div>
            <div>A</div>
        </div>
    )
};

const playerHand = [
    { id: 1, rank: "A", suit: "Spades" },
    { id: 2, rank: "10", suit: "Hearts" },
    { id: 3, rank: "K", suit: "Clubs" },
    { id: 4, rank: "K", suit: "Clubs" },
    { id: 5, rank: "K", suit: "Clubs" },
    { id: 6, rank: "K", suit: "Clubs" }

    
];

const enemyCards = [1,2,3,4,5,6,7]