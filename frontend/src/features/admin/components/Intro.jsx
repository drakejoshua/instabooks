import Heading from "../../../shared/components/Heading";

// Intro component - This component is used to display an 
// introductory section with a title and optional actions for the
// admin dashboard. It accepts a title, children (for actions),
// and an optional className for additional styling. The title is 
// displayed using the Heading component, and the children are 
// rendered in a flex container for layout.


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
        {/* intro title */}
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
