import FormField from "./FormField";

// TextField component
// This component is a specialized form field for text input. 
// It uses the FormField component and sets the type to "text". 
// It accepts props such as name, label, className, and valueMissingMessage 
// to customize its behavior and appearance.

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
