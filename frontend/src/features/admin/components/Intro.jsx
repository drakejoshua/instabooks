import Heading from "../../../shared/components/Heading";

function Intro({ title = "", children, className = ""}) {
    return <section 
        className={`
            pt-4
            flex
            justify-between
            flex-wrap
            items-center
            gap-6
            ${className}
        `}
    >
        <Heading>
            { title }
        </Heading>

        {/* intro actions */}
        <div
            className="
                flex
                gap-4
                flex-wrap

                *:capitalize
            "
        >
            { children }
        </div>
    </section>;
}

export default Intro;
