import FormField from "./FormField";

// EmailField component
// This component is a specialized form field for email input. 
// It uses the FormField component and sets the type to "email". 
// It accepts props such as name, label, className, valueMissingMessage, 
// and typeMismatchMessage to customize its behavior and appearance.

function EmailField({
    name,
    label,
    children,
    className,
    valueMissingMessage,
    typeMismatchMessage,
    ...props
}) {
    return <FormField
        type="email"
        name={name}
        className={className}
        label={label}
        valueMissingMessage={valueMissingMessage}
        typeMismatchMessage={typeMismatchMessage}
        {...props}
    >
        { children }
    </FormField>;
}

export default EmailField;
