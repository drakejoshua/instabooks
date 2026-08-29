import { Dialog } from "radix-ui";
import { FaXmark } from "react-icons/fa6";
import Heading from "../components/Heading";
import { useDispatch, useSelector } from "react-redux";
import { addDialog, removeDialog } from "../uiSlice";

// useDialogActions() hook 
// This is a custom hook that provides functions 
// for opening and closing dialogs.
export function useDialogActions() {
    const dispatch = useDispatch();

    return {
        // openDialog function - opens a new dialog with the 
        // specified title, description, and content
        openDialog(dialog) {
            // dialogs should have title, description and render
            let dialogId = crypto.randomUUID();

            dispatch(
                addDialog({
                    id: dialogId,
                    title: dialog.title || "",
                    description: dialog.description || "",
                    content: dialog.render() || "",
                }),
            );

            return dialogId;
        },
        // closeDialog function - closes an existing dialog by its ID
        closeDialog(dialogId) {
            dispatch(removeDialog(dialogId));
        },
    };
}

// DialogRenderer component
// This component is responsible for rendering dialogs 
// based on the state of the application. It listens to 
// the Redux store for any dialogs that need to be displayed 
// and renders them accordingly.
function DialogRenderer({ children }) {
    const dialogs = useSelector(function (state) {
        return state.ui.dialogs;
    });

    const { closeDialog } = useDialogActions();

    return (
        <div>
            {children}

            {dialogs.map(function (dialog) {
                return (
                    <DialogComponent
                        defaultOpen={true}
                        onOpenChange={(isOpen) => {
                            if (!isOpen) {
                                closeDialog(dialog.id);
                            }
                        }}
                        key={dialog.id}
                        title={dialog.title}
                        description={dialog.description}
                        children={dialog.content}
                    />
                );
            })}
        </div>
    );
}

export default DialogRenderer;

// DialogComponent component
// This component is responsible for rendering a single dialog. 
// It takes in props such as title, description, and children 
// components that can be rendered within the dialog. 
// The major difference between this component and the DialogRenderer 
// component is that this component is responsible for rendering a 
// single dialog in another component or page whereby the parent's state 
// needs to be accessible in that dialog as the dialogs rendered by 
// the DialogRenderer component can't use the state from the parent 
// that opened the dialogs as they are rendered in a different component tree.
export function DialogComponent({ title, description, children, ...props }) {
    return (
        <Dialog.Root {...props}>
            <Dialog.Portal>
                {/* black dialog overlay */}
                <Dialog.Overlay
                    className="
                        fixed
                        inset-0
                        bg-black/50
                        backdrop-blur-sm
                    "
                />

                {/* dialog content */}
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
                    {/* close button */}
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

                    {/* dialog title */}
                    <Dialog.Title asChild>
                        <Heading
                            variant="route"
                            className="
                                mt-8!
                            "
                        >
                            {title}
                        </Heading>
                    </Dialog.Title>

                    {/* dialog description */}
                    <Dialog.Description
                        className="
                            text-center
                            mb-4
                            text-instabooks-black
                        "
                    >
                        {description}
                    </Dialog.Description>

                    {/* dialog body */}
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
