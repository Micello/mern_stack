import Card from "./Card";

export function OpponentHand({ HandSize, playerScore}) {
  // Create an array with HandSize length to simulate card data
  const cards = Array.from({ length: HandSize }, (_, index) => ({
    id: index + 1, // Unique id for each card
    scale: 1.1,      // 
  }));

  return (
    <>
      <div><Card /></div>
      <ul className="flex h-full justify-center">
        {cards.map((card) => {
          // Calculate angle and height dynamically for each card based on its position
          const angle = 0.02 * (card.id - ((cards.length + 1) / 2));
          const height = 0.4 * (card.id - (cards.length + 1) / 2) * (card.id - (cards.length + 1) / 2);

          return (
            <li className='h-full' key={card.id}>
              <Card
                id={card.id}
                location={1}
                angle={angle}
                height={height}
                scale={card.scale}
                
              />
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





export function Hand({ Hand, playerScore, onCardClick }) {
  
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
                      location={0}
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