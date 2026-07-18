import AnimatedWarningIconImage from "../../assets/animated-warning-icon.webp";

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
