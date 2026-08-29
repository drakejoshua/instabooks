import Button from "./Button";

// AltButton component
// This component is a styled button that serves 
// as an alternative to the primary button style. 
// It uses the Button component and applies specific 
// styles to create a distinct appearance. 

function AltButton({ children, className, ...props }) {
    return <Button
        className={`
            outline-2
            outline-instabooks-blue
            bg-white hover:bg-instabooks-blue
            text-instabooks-blue! hover:text-white!
            opacity-100!
            ${ className || "" }
        `}
        {...props}
    >
        {children}
    </Button>;
}

export default AltButton;
