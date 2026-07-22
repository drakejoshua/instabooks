function RouteHeading({ className, children, ...props }) {
    return <h1
        className={`
            mt-6 lg:mt-4
            mb-2
            text-center
            ${className || ""}
        `}
        {...props}
    >
        { children }
    </h1>;
}

export default RouteHeading;
