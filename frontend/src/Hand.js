import Card from "./Card";

export default function Hand({ Hand, playerScore, onCardClick }) {
  
    return (
      <>
        <div><Card /></div>
        <ul className="flex h-full justify-center   ">
          {Hand.map((card) => {
              const angle = 0.02*(card.id - ((Hand.length+1)/2))
              const height = 0.4*(card.id - (Hand.length+1)/2)*(card.id-(Hand.length+1)/2)
              return (
              <li className='h-full' key={card.id}>
                <Card id={card.id}
                      rank={card.rank}
                      suit={card.suit}
                      angle={angle}
                      height={height}
                      scale={card.scale}
                      onClick={() => onCardClick(card)}/>
              </li>
            );
          })}
        </ul>
      <div className="text-4xl flex flex-col justify-center">
          {'Score: ' + playerScore}
      </div>
      </>
    );
  }