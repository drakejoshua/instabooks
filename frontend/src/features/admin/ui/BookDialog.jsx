import { Form } from "radix-ui";
import { DialogComponent } from "../../../shared/ui/DialogRenderer";
import TextField from "../../../shared/components/TextField";
import FormField from "../../../shared/components/FormField";
import Button from "../../../shared/components/Button";

export function BookDialog({
    title,
    description,
    open,
    onOpenChange,
    bookDetails,
    setBookDetails,
    handleSubmit,
    isSubmitting,
    submitButtonLabel = "Add book",
    loadingButtonLabel = "Adding book..."
}) {
    return (
        <DialogComponent
            title={ title }
            description={ description }
            open={ open }
            onOpenChange={ onOpenChange }
        >
            <Form.Root
                onSubmit={ handleSubmit}
                className="mt-4"
            >
                <div 
                    className="flex flex-col gap-4"
                >
                    {/* title */}
                    <TextField
                        label="Title: "
                        name="title"
                        value={ bookDetails.title }
                        onChange={ (e) => setBookDetails( prev => ({
                            ...prev,
                            title: e.target.value
                        })) }
                        required
                        valueMissingMessage="Please enter the title of the book"
                    />

                    {/* description */}
                    <TextField
                        label="Description: "
                        name="description"
                        value={ bookDetails.description }
                        onChange={ (e) => setBookDetails( prev => ({
                            ...prev,
                            description: e.target.value
                        })) }
                        required
                        valueMissingMessage="
                            Please enter the description of the book
                        "
                    />

                    {/* pages */}
                    <FormField
                        label="Pages: "
                        name="pages"
                        value={ bookDetails.pages }
                        onChange={ (e) => setBookDetails( prev => ({
                            ...prev,
                            pages: e.target.value
                        })) }
                        required
                        valueMissingMessage="
                            Please enter the number of pages of the book
                        "
                        type="number"
                    />

                    {/* price */}
                    <FormField
                        name="price"
                        label="Price: "
                        value={ bookDetails.price }
                        onChange={ (e) => setBookDetails( prev => ({
                            ...prev,
                            price: e.target.value
                        })) }
                        required
                        valueMissingMessage="
                            Please enter the price of the book
                        "
                        type="number"
                    />

                    {/* author */}
                    <TextField
                        name="author"
                        label="Author: "
                        value={ bookDetails.author }
                        onChange={ (e) => setBookDetails( prev => ({
                            ...prev,
                            author: e.target.value
                        })) }
                        required
                        valueMissingMessage="
                            Please enter the author of the book
                        "
                    />

                    {/* genre */}
                    <TextField
                        name="genre"
                        label="Genre: "
                        value={ bookDetails.genre }
                        onChange={ (e) => setBookDetails( prev => ({
                            ...prev,
                            genre: e.target.value
                        })) }
                        required
                        valueMissingMessage="
                            Please enter the genre of the book
                        "
                    />

                    {/* quantity */}
                    <FormField
                        name="quantity"
                        label="Quantity: "
                        value={ bookDetails.quantity }
                        onChange={ (e) => setBookDetails( prev => ({
                            ...prev,
                            quantity: e.target.value
                        })) }
                        required
                        valueMissingMessage="
                            Please enter the quantity of the book
                        "
                        type="number"
                    />

                    {/* cover photo url */}
                    <div>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={ (e) => setBookDetails( prev => ({
                                ...prev,
                                photo: e.target.files[0]
                            })) }
                            className="
                                block
                                w-full
                                outline-none focus-within:outline-[initial]
                                bg-instabooks-black
                                text-white
                                rounded-lg
                                px-4 py-2
                                disabled:cursor-not-allowed
                                disabled:opacity-70
                            "
                            placeholder="Select a cover photo"
                            
                        />

                        { bookDetails.photo && 
                            <img 
                                src={ 
                                    URL.createObjectURL(bookDetails.photo) 
                                } 
                                alt="Cover" 
                                className="
                                    mt-4
                                    w-full
                                    h-80
                                    object-cover
                                    rounded-lg
                                    block
                                "
                            /> 
                        }
                    </div>
                </div>

                <Form.Submit asChild>
                    <Button
                        className="
                            mt-4
                            w-full
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                        disabled={ 
                            isSubmitting
                        }
                    >
                        {
                            ( isSubmitting ) ?
                            loadingButtonLabel :
                            submitButtonLabel
                        }
                    </Button>
                </Form.Submit>
            </Form.Root>
        </DialogComponent>
    )
}