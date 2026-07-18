import React from "react";
import InstabooksBlackLogo from "../../assets/instabooks-logo-black.png";
import { Link } from "react-router-dom";

let Logo = React.forwardRef((props, ref) => {
    return <Link to="/">
        <img src={InstabooksBlackLogo} alt="Instabooks Logo" ref={ref} {...props} />
    </Link>;
});

export default Logo;
