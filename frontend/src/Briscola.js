function Card({id, rank, suit}){
    return(
        <>
        {rank ? <div className="Card">{id + rank + suit}</div>: <div className="Card">Back</div>} 
        </>
    )
};

function Hand({playerHand}){
    return(
        <ul>
            {playerHand.map((card) =>(
                <li key={card.id}>
                    <Card id={card.id} rank={card.rank} suit={card.suit} />
                </li>
            ))}
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
    { id: 3, rank: "K", suit: "Clubs" }
];

const enemyHand = [
    { id: 1, rank: null, suit: null },
    { id: 2, rank: null, suit: null },
    { id: 3, rank: null, suit: null }
];