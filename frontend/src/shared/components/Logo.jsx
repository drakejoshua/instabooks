import React from "react";
import InstabooksBlackLogo from "../../assets/instabooks-logo-black.png";
import { Link } from "react-router-dom";

// Logo component
// This component is responsible for rendering the Instabooks logo. 
// It accepts a "clickable" prop that determines whether the logo 
// should be wrapped in a Link component to navigate to the home page. 
// If "clickable" is true, the logo will be clickable and redirect 
// to the home page; otherwise, it will be a static image.

let Logo = React.forwardRef(( { clickable = true, ...props }, ref) => {
    return !clickable ? 
        <img src={InstabooksBlackLogo} alt="Instabooks Logo" ref={ref} {...props} /> :
        <Link to="/">
            <img src={InstabooksBlackLogo} alt="Instabooks Logo" ref={ref} {...props} />
        </Link>;
});

export default Logo;
