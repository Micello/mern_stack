import asso from './Images/asso.jpg'
import back from './Images/back.jpg'

export default function Card({ id, rank, suit, angle, height, scale, onClick }) {
    const safeAngle = angle || 0; // Default to 0 if angle is undefined
    const safeHeight = height || 0; // Default to 0 if height is undefined
    const safeScale = scale || 1; // Default to 0 if height is undefined
    const handleMouseEnter = rank && rank !== "slot" ? (e) => { e.currentTarget.style.transform = `rotate(${safeAngle}rad) translateY(${safeHeight * 10 - 40}px) translateX(${safeAngle * -900}px)`} : 
        (e) => {//se non ha un seme (non è nella mia mano)
            
            e.currentTarget.style.transform = `scale(${safeScale}) rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -900}px) `};
    
    const handleMouseLeave = rank ? (e) => {
                e.currentTarget.style.transform = `rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -900}px) scale(${safeScale})`
            } :
            (e) => {e.currentTarget.style.transform = `scale(1) rotate(${safeAngle}rad) translateY(${safeHeight * 10}px) translateX(${safeAngle * -900}px) `};
        
            
    return (
      <div
        style={{
          transform: `rotate(${angle}rad) translateY(${height * 10}px) translateX(${angle * -900}px)`, //posizione iniziale dopo f5
          width: '', // Ensure both width and height are calculated the same way
          height: '',
          
        }}
        className={`max-w-[125px] max-h-[200px] h-full rounded-md  relative  box-border   border-2 border-solid border-[black] transition-transform duration-300 ease-in-out`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {rank && rank !== "slot" ? <img src={asso} className=' rounded-md h-full' /> : rank=="slot" ? <img src={back} className='opacity-5'/> : <img src={back} className='h-full  rounded-md'/>}
        
      </div>
    );
  }
