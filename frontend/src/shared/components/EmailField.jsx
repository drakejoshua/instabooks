import FormField from "./FormField";

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
