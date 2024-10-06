

function Card({id, rank, suit, angle, height}){
    return(
        <>
            {rank ? (
            <div
            style={{ transform: `rotate(${angle}rad) translateY(${height*10}px) translateX(${angle*-400}px)` }} 
            className={`relative  focus:ring-violet-300 active:bg-violet-700 bg-[lightgrey] hover:bg-gray-50 h-48 w-32 box-border m-2 p-4 border-2 border-solid border-[black]`}
    
            >
                {id + rank + suit + '                ' + angle + height}
            </div>
            ) : (
            <div className="bg-[lightgrey] w-24 h-40 m-2 p-4 border-2 border-solid border-[black]">
                Back
            </div>
            )}
      </>
    )
}

function Hand({ playerHand }) {
    return (
      <ul className="flex justify-center items-center  ">
        {playerHand.map((card,index) => {
            const angle = 0.06*(card.id - ((playerHand.length+1)/2))
            const height = 0.5*(card.id - (playerHand.length+1)/2)*(card.id-(playerHand.length+1)/2)
            console.log(height)
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
        <div className="Board">
            <div className="Card">mazzo</div>
        </div>
    )
}

export default function Briscola(){

    
    return(
        <>
            <div>
                <p>mano p2</p>
                <Hand playerHand={enemyHand}/>
            </div>
            <Board />
            <div>
                <p>mano p1</p>
                <Hand playerHand={playerHand}/>
            </div>        
        </>
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

const enemyHand = [
    { id: 1, rank: null, suit: null },
    { id: 2, rank: null, suit: null },
    { id: 3, rank: null, suit: null }
];