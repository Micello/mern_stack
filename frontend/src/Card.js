import asso from './Images/asso.jpg'
import back from './Images/back.jpg'

export default function Card({ id, rank, suit, angle, height, scale }) {
    const safeAngle = angle || 0; // Default to 0 if angle is undefined
    const safeHeight = height || 0; // Default to 0 if height is undefined
    const safeScale = scale || 1; // Default to 0 if height is undefined
    const handleMouseEnter = rank ? (e) => { e.currentTarget.style.transform = `rotate(${safeAngle}rad) translateY(${safeHeight * 10 - 40}px) translateX(${safeAngle * -200}px)`} : 
        (e) => {//se non ha un seme (non è nella mia mano)
            
            e.currentTarget.style.transform = `scale(${safeScale}) rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -200}px) `};
    
    const handleMouseLeave = rank ? (e) => {
                e.currentTarget.style.transform = `rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -200}px) scale(${safeScale})`
            } :
            (e) => {e.currentTarget.style.transform = `scale(1) rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -200}px) `};
        
  
    return (
      <div
        style={{
          transform: `rotate(${angle}rad) translateY(${height * 10}px) translateX(${angle * -200}px)`, //posizione iniziale dopo f5
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
