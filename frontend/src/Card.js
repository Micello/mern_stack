import spritesheet from './Images/spritesheet.jpg'
import back from './Images/back.jpg'

export default function Card({ id, rank, suit, angle, location, height, scale, onClick }) {  //location: 0 myhand, 1 opphand, 2 board, 3 other
  const safeAngle = angle || 0; // Default to 0 if angle is undefined
  const safeHeight = height || 0; // Default to 0 if height is undefined
  const safeScale = scale || 1; // Default to 0 if height is undefined
  const handleMouseEnter = location == 0 ? (e) => { e.currentTarget.style.transform = `rotate(${safeAngle}rad) translateY(${safeHeight * 10 - 40}px) translateX(${safeAngle * -900}px)` } :
    (e) => {//(non è nella mia mano)

      e.currentTarget.style.transform = `scale(${safeScale}) rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -900}px) `
    };

  const handleMouseLeave = location == 0 ? (e) => {
    e.currentTarget.style.transform = `rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -900}px) scale(${safeScale})`
  } :
    (e) => { e.currentTarget.style.transform = `scale(1) rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -900}px) ` };






  // Map suits and ranks to their positions in the spritesheet grid
  const suits = ['denari', 'coppe', 'bastoni', 'spade']; // Example suit order

  // Find the index of the suit and rank
  const suitIndex = suits.indexOf(suit);
  // Calculate the size of each card in the sprite sheet (e.g., if it's a grid of 13x4 cards)
  const cardWidth = 80; // Replace with actual width of one card in the spritesheet
  const cardHeight = 137; // Replace with actual height of one card in the spritesheet

  // Calculate background position to show the correct card
  const backgroundPositionX = -rank * cardWidth;
  const backgroundPositionY = -suitIndex * cardHeight;

  return (
    <div
      style={{
        transform: `rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${angle * -900}px)`,
        width: '80px', // Assuming each card is 125px wide, adjust if needed
        height: '137px', // Assuming each card is 200px tall, adjust if needed
        backgroundImage: location === 0 || (location === 2 && suit !== "") ? `url(${spritesheet})` : 'none',
        backgroundPosition: `${backgroundPositionX}px ${backgroundPositionY}px`,
        backgroundSize: `${cardWidth * 10}px ${cardHeight * 4}px`, // This ensures the whole spritesheet is scaled correctly
      }}
      className={`max-w-[80px] max-h-[137px] h-full rounded-md relative box-border border-2 border-solid border-[black] transition-transform duration-300 ease-in-out`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {location !== 0 && location !== 2 ?
         <img src={back} className='h-full  rounded-md' />
        : null
      }
    </div>
  );
}
