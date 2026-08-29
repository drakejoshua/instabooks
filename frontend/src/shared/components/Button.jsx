import React from "react";
import { Slot } from 'radix-ui';

// Button component
// This component is a reusable button that can be rendered 
// as a different HTML element or component if desired, using
// the asChild prop. It accepts children, className, and other
// props to customize its appearance and behavior. The button 
// has default styles for background color, text color, padding, 
// and border radius, which can be overridden by passing a 
// custom className.

const Button = React.forwardRef( function( {
    children,
    className,
    asChild,
    ...props
}, ref ) {
    // generate the component to render based on the asChild prop
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
