// Badge component
// This component is a styled badge that can be used to
// display small pieces of information, such as labels or
// status indicators. It's used on the order preview on the
// profile page and admin orders page to indicate the status 
// of an order.

export default function Badge({ children, className = "" }) {
    return (
        <span 
            className={`
                capitalize
                bg-instabooks-blue
                font-medium
                text-white
                px-3.5 py-0.5
                rounded-full
                inline-block
                ${className}
            `}
        >
            { children }
        </span>
    )
}