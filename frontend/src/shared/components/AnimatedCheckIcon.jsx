import AnimatedCheckIconImage from "../../assets/animated-check-icon.webp";

function AnimatedCheckIcon({ className, ...props }) {
    return <img 
        src={ AnimatedCheckIconImage } 
        alt="animated check icon" 
        className={`
            w-20 lg:w-30
            h-20 lg:h-30
            mx-auto
            mt-8 lg:mt-12
            ${ className || ""}
        `} 
        { ...props }
    />;
}

export default AnimatedCheckIcon;
