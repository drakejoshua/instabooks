import { Form } from "radix-ui";
import React from "react";
import FormField from "./FormField";

function TextField({ 
    name,
    label, 
    children, 
    valueMissingMessage,
    className,
    ...props 
}) {
    return <FormField
        type="text"
        name={name}
        className={className}
        label={label}
        valueMissingMessage={valueMissingMessage}
        {...props}
    >
        { children }
    </FormField>
}

export default TextField;
