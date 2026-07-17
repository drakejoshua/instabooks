import React from "react";
import InstabooksBlackLogo from "../../assets/instabooks-logo-black.png";

let Logo = React.forwardRef((props, ref) => {
    return <img src={InstabooksBlackLogo} alt="Instabooks Logo" ref={ref} {...props} />;
});

export default Logo;
