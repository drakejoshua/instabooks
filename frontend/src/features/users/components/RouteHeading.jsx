function RouteHeading({ className, children, ...props }) {
    return <h1
        className={`
            mt-6 lg:mt-4
            text-3xl
            font-medium
            mb-2
            text-center
            leading-10
            text-instabooks-black
            ${className || ""}
        `}
        {...props}
    >
        { children }
    </h1>;
}

export default RouteHeading;
