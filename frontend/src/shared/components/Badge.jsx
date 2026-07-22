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