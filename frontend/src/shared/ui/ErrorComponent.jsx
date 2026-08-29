import AltButton from "../components/AltButton";
import Heading from "../components/Heading";
import Logo from "../components/Logo";

// ErrorComponent component
// This component is responsible for displaying an error message 
// when an error occurs on the page. It takes in an error object
// and a reset function as props. The error object contains the
// error message to be displayed, and the reset function is called
// when the user clicks the "Reset page" button to reload the page.

function ErrorComponent({ error, reset }) {
    return <div
        className="
            w-full
            max-w-lg
            mx-auto
            pt-2 px-6 pb-10 lg:pb-4 lg:px-2
        "
    >
        {/* instabooks logo */}
        <Logo
            clickable={false}
            className=" 
                h-10
                block
                mx-auto
                mt-12
            "
        />
    
        <Heading
            className="
                mt-8
                text-center
            "
        >
            Oops! An error occurred on the page you 
            were trying to access.
        </Heading>

        {/* error description */}
        <p
            className="
                mt-4
                text-center
            "
        >
            This could be due to a network issue, 
            a server error, or an unexpected problem with the 
            application. Please try reloading the page or come 
            back later.
        </p>

        {/* retry/reset button */}
        <AltButton
            onClick={reset}
            className="
                mt-8
                mx-auto
                block!
                cursor-pointer
            "
        >
            Reset page
        </AltButton>

        {/* error details */}
        <code
            className="
                mt-12
                block
                bg-gray-700
                text-white
                p-4
                rounded-md
                text-sm
                whitespace-pre-wrap
                max-h-50
                overflow-y-auto
                overflow-x-hidden
            "
        >
            {
                error?.message
            }
        </code>
    </div>;
}

export default ErrorComponent;
