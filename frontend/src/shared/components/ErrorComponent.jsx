import Logo from "./Logo.jsx";
import Heading from "./Heading.jsx";
import AltButton from "./AltButton.jsx";

function ErrorComponent({ error, reset }) {
    return <div
        className="
            w-full
            max-w-lg
            mx-auto
            pt-2 px-6 pb-10 lg:pb-4 lg:px-2
        "
    >
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
