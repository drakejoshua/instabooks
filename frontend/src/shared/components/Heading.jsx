// Heading component
// This component is responsible for rendering headings in the application. 
// It accepts props such as "as" (to specify the HTML element to render),
// "variant" (to specify the heading style), "className" (to apply custom 
// styles), and "children" (to specify the heading content). 
// The component uses a variants object to define different heading styles 
// based on the variant prop, allowing for consistent styling across the app.

export default function Heading({
    as: As = "h1",
    variant = "default",
    className,
    children,
    ...props
}) {
    const variants = {
        default: `
            text-3xl
            capitalize
            text-instabooks-black
            leading-10
        `,
        route: `
            text-3xl
            capitalize
            text-instabooks-black
            leading-10
            mt-6
            lg:mt-4
            mb-2
            text-center
        `,
    };

    return (
        <As
            className={`
                ${variants[variant]}
                ${className ?? ""}
            `}
            {...props}
        >
            {children}
        </As>
    );
}