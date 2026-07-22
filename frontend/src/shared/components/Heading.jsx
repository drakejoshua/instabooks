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