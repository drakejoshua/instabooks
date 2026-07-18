import Button from "./Button";

function AltButton({ children, ...props }) {
    return <Button
        className="
            outline-2
            outline-instabooks-blue
            bg-white hover:bg-instabooks-blue
            text-instabooks-blue! hover:text-white!
            opacity-100!
        "
        {...props}
    >
        {children}
    </Button>;
}

export default AltButton;
