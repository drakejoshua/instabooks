import React from "react";

const Button = React.forwardRef( function( {
    children,
    className,
    ...props
}, ref ) {
    return <button 
        className={`
            bg-instabooks-blue hover:opacity-90
            text-white
            font-medium
            px-5
            py-2
            outline-2
            outline-instabooks-blue
            rounded-md
            ${className}
        `}
        ref={ref} 
        {...props}
    >
        {children}
    </button>;
})

export default Button;
