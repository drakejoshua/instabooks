import React from "react";
import Button from "../../../shared/components/Button";

export function Component() {
    return <div>
        <h1>Sign into your account</h1>

        <p>
            Welcome back! Please continue with your Google 
            account to access your Instabooks account. You
            will be redirected to the Google sign-in page.
        </p>

        <Button>
            Sign in with google
        </Button>
    </div>;
}
