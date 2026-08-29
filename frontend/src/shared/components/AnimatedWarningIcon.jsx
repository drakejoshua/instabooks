import AnimatedWarningIconImage from "../../assets/animated-warning-icon.webp";

// AnimatedWarningIcon component
// This component displays an animated warning icon, 
// typically used to indicate a warning or error state. 
// It accepts additional props and className for customization.

function AnimatedWarningIcon({ className, ...props }) {
    return <img 
        src={ AnimatedWarningIconImage } 
        alt="animated warning icon" 
        className={`
            w-20 
            h-20 
            mx-auto
            mt-8 lg:mt-12
            ${ className || ""}
        `} 
        { ...props }
    />;
}

export default AnimatedWarningIcon;
