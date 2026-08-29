import { Form } from "radix-ui";

// FormField component
// This component is a reusable form field that can be used 
// to create input fields with labels and validation messages.
// It accepts props such as name, label, className, inputClassName,
// valueMissingMessage, and typeMismatchMessage to customize its 
// behavior and appearance. It uses the Radix UI Form components 
// to handle form field rendering and validation.

function FormField({ 
    name,
    label, 
    children, 
    inputClassName,
    className,
    valueMissingMessage = "",
    typeMismatchMessage = "",
    ...props 
}) {
    return <Form.Field 
        name={name}
        className={`
            flex
            flex-col
            gap-2
            ${ className || "" }
        `}
    >
        <Form.Label
            className="
                capitalize
            "
        >
            { label }
        </Form.Label>

        <Form.Control asChild>
            <input 
                name={name}
                id={name}
                className={`
                    bg-gray-200
                    text-instabooks-black
                    outline-2
                    outline-instabooks-blue
                    font-medium
                    rounded-md
                    px-4 py-3
                    focus-within:outline-instabooks-black
                    focus:outline-instabooks-black
                    ${ inputClassName || "" }
                `}
                { ...props }
            />
        </Form.Control>

        { valueMissingMessage && <Form.Message 
            match="valueMissing"
            className="
                capitalize
                text-red-600
            "
        >
            { valueMissingMessage }
        </Form.Message>}

        { typeMismatchMessage && <Form.Message 
            match="typeMismatch"
            className="
                capitalize
                text-red-600
            "
        >
            { typeMismatchMessage }
        </Form.Message>}

        { children }
    </Form.Field>;
}

export default FormField;
