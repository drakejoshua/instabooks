import React from "react";
import { Slot } from 'radix-ui';

const Button = React.forwardRef( function( {
    children,
    className,
    asChild,
    ...props
}, ref ) {
    let Component = asChild ? Slot.Root : "button";

    return <Component 
        className={`
            bg-instabooks-blue hover:opacity-90
            text-white
            font-medium
            px-5
            py-2
            outline-2
            outline-instabooks-blue
            rounded-md
            inline-block
            text-center
            ${className}
        `}
        ref={ref} 
        {...props}
    >
        {children}
    </Component>;
})

export default Button;
