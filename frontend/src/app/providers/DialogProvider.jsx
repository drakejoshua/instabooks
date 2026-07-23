import { createContext, useContext, useState } from "react";
import { Dialog } from "radix-ui";
import { FaXmark } from "react-icons/fa6";
import Heading from "../../shared/components/Heading";

const DialogContext = createContext();

export function useDialogProvider() {
    let context = useContext(DialogContext);

    if (!context) {
        throw new Error("useDialogProvider must be used within a DialogProvider");
    }

    return context;
}

function DialogProvider({ children }) {
    const [ dialogs, setDialogs ] = useState([]);

    function openDialog(dialog) {
        let dialogId = crypto.randomUUID();

        setDialogs(prevDialogs => [
            ...prevDialogs,
            {
                id: dialogId,
                title: dialog.title || "",
                description: dialog.description || "",
                content: dialog.render() || ""
            }
        ]);

        return dialogId;
    }

    function closeDialog(dialogId) {
        setDialogs(prevDialogs => prevDialogs.filter(dialog => dialog.id !== dialogId));
    }

    return (
        <DialogContext.Provider value={{ openDialog, closeDialog }}>
            {children}

            {
                dialogs.map( function( dialog ) {
                    return (
                        <DialogComponent
                            defaultOpen={ true }
                            onOpenChange={ ( isOpen ) => {
                                if ( !isOpen ) {
                                    closeDialog( dialog.id );
                                }
                            } }
                            key={ dialog.id }
                            title={ dialog.title }
                            description={ dialog.description }
                            content={ dialog.content }
                        />
                    )
                })
            }
        </DialogContext.Provider>
    );
}

export default DialogProvider;


export function DialogComponent({ title, description, content, ...props }) {
    return (
        <Dialog.Root
            {...props}
        >
            <Dialog.Portal>
                <Dialog.Overlay 
                    className="
                        fixed
                        inset-0
                        bg-black/50
                        backdrop-blur-sm
                    "
                />

                <Dialog.Content
                    className="
                        fixed
                        top-1/2
                        left-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        bg-white
                        rounded-lg
                        p-6
                        w-11/12
                        max-w-lg
                        max-h-[70vh]
                        overflow-y-auto
                    "
                >
                    <Dialog.Close asChild>
                        <button
                            className="
                                absolute
                                top-5
                                right-5
                                text-2xl
                                text-gray-500
                                hover:text-gray-700
                            "
                        >
                            <FaXmark />
                        </button>
                    </Dialog.Close>

                    <Dialog.Title asChild>
                        <Heading 
                            variant="route"
                            className="
                                mt-8!
                            "
                        >
                            { title }
                        </Heading>
                    </Dialog.Title>

                    <Dialog.Description
                        className="
                            text-center
                            mb-4
                            text-instabooks-black
                        "
                    >
                        { description }
                    </Dialog.Description>

                    { content }
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}