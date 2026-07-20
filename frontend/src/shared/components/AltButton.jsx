import Button from "./Button";

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
