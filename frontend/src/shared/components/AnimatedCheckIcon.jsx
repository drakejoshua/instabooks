import AnimatedCheckIconImage from "../../assets/animated-check-icon.webp";

// AnimatedCheckIcon component
// This component displays an animated check icon, 
// typically used to indicate a successful action or 
// completion of a task. It accepts additional props 
// and className for customization.

function AnimatedCheckIcon({ className, ...props }) {
    return <img 
        src={ AnimatedCheckIconImage } 
        alt="animated check icon" 
        className={`
            w-20 lg:w-25
            h-20 lg:h-25
            mx-auto
            mt-8 lg:mt-12
            ${ className || ""}
        `} 
        { ...props }
    />;
}

export default AnimatedCheckIcon;
