import { Dialog } from "radix-ui";
import { FaXmark } from "react-icons/fa6";
import Heading from "../components/Heading";
import { useDispatch, useSelector } from "react-redux";
import { addDialog, removeDialog } from "../uiSlice";

export function useDialogActions() {
    const dispatch = useDispatch();

    return {
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
        closeDialog(dialogId) {
            dispatch(removeDialog(dialogId));
        },
    };
}

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

export function DialogComponent({ title, description, children, ...props }) {
    return (
        <Dialog.Root {...props}>
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
                            {title}
                        </Heading>
                    </Dialog.Title>

                    <Dialog.Description
                        className="
                            text-center
                            mb-4
                            text-instabooks-black
                        "
                    >
                        {description}
                    </Dialog.Description>

                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
