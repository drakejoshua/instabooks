import { FaArrowsRotate, FaCircleArrowLeft } from "react-icons/fa6";
import AnimatedWarningIcon from "../components/AnimatedWarningIcon";
import Heading from "../components/Heading";
import Button from "../components/Button";
import { getErrorMessage } from "../utils/utils";

// RouteError component
// This component is responsible for displaying an error message 
// when an error occurs on a specific route. It takes in various
// props such as the heading, error object, refetch function,
// text to display, button label, and retry loading status. It 
// provides a user-friendly interface for handling route errors.

function RouteError({
    heading = "An error occurred on this page",
    error = null,
    refetch = () => {},
    text = "Please try again later. Error code:",
    buttonLabel = "retry",
    retryLoadingStatus = false
}) {
    return <div
        className="
            w-full
            max-w-lg
            mx-auto
            mt-4
            flex
            flex-col
            items-center
        "
    >
        <AnimatedWarningIcon />

        <Heading
            className="
                mt-4
                text-center
            "
        >
            { heading }
        </Heading>

        {/* 
            error message - merging text and actual error 
            message to provide more context to the user
        */}
        <p className="mt-2 text-center">
            { text } {
                getErrorMessage( error )
            }
        </p>

        {/* retry button */}
        <Button
            onClick={ () => refetch() }
            className="
                mt-8
                flex!
                gap-2
                items-center
                group
                disabled:opacity-50
                disabled:cursor-not-allowed
            "
            disabled={ retryLoadingStatus }
        >
            <FaArrowsRotate 
                className="
                    group-disabled:animate-spin
                "
            />
            <span> 
                { buttonLabel }
            </span>
        </Button>
    </div>;
}

export default RouteError;
