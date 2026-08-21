import { FaArrowsRotate, FaCircleArrowLeft } from "react-icons/fa6";
import AnimatedWarningIcon from "../components/AnimatedWarningIcon";
import Heading from "../components/Heading";
import Button from "../components/Button";
import { getErrorMessage } from "../utils/utils";

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

        <p className="mt-2 text-center">
            { text } {
                getErrorMessage( error )
            }
        </p>

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
