import { DropdownMenu, Form } from "radix-ui";
import TextField from "../../../shared/components/TextField";
import EmailField from "../../../shared/components/EmailField";
import Button from "../../../shared/components/Button";
import UserAvatar from "../../../shared/components/UserAvatar";
import { FaFileArrowUp, FaTrash } from "react-icons/fa6";
import { AddressListItem } from "../components/AddressListItem";
import { OrderPreview } from "../components/OrderPreview";
import Heading from "../../../shared/components/Heading";

export function Component() {
    return (
        <div
            className="
            block lg:grid
            lg:grid-cols-[1fr_4fr]
            gap-12
            pb-8
        "
        >
            <aside
                className="
                hidden lg:flex
                flex-col
                text-lg
                capitalize
                sticky
                top-8
                self-start

                *:cursor-pointer
                *:px-4 *:py-3
                *:capitalize
                *:text-left
            "
            >
                <button
                    className="
                    bg-instabooks-blue
                    text-white
                    rounded-lg
                "
                >
                    profile
                </button>

                <button>orders</button>
            </aside>

            <section
                className="
                max-w-lg
            "
            >
                <div>
                    <Heading as="h2">your profile</Heading>

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <UserAvatar
                                className="
                                h-40
                                w-40
                                mt-8
                            "
                                src="https://mages.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                                alt="Colm Tuite"
                                iconClassName="text-[36px]"
                            />
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                side="right"
                                sideOffset={8}
                                align="center"
                                className="
                                bg-instabooks-black
                                text-white
                                rounded-lg
                                px-4 py-5

                                *:flex
                                *:items-center
                                *:gap-2
                                *:capitalize
                                *:px-4 *:py-2
                                *:hover:bg-white
                                *:hover:text-instabooks-black
                                *:focus:bg-white
                                *:focus:text-instabooks-black
                                *:outline-none
                                *:rounded-md
                                *:cursor-pointer
                            "
                            >
                                <DropdownMenu.Item>
                                    <FaFileArrowUp />
                                    upload new photo
                                </DropdownMenu.Item>

                                <DropdownMenu.Item>
                                    <FaTrash />
                                    remove photo
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>

                    {/* profile info */}
                    <Form.Root
                        className="
                        mt-8
                        flex
                        flex-col
                        gap-2.5
                        items-start 
                    "
                    >
                        {/* name */}
                        <TextField
                            name="name"
                            label="Name"
                            className="w-full"
                            valueMissingMessage="your name can't be omitted"
                            required
                        />

                        {/* email */}
                        <EmailField
                            name="email"
                            label="email"
                            className="w-full"
                            valueMissingMessage={"your email can't be omitted"}
                            typeMismatchMessage={"your email is invalid"}
                        />

                        <Form.Submit asChild>
                            <Button className="capitalize mt-4">
                                update profile
                            </Button>
                        </Form.Submit>
                    </Form.Root>

                    {/* addresses */}
                    <div
                        className="
                        mt-8
                    "
                    >
                        <span
                            className="
                            capitalize
                        "
                        >
                            saved addresses
                        </span>

                        {/* address list */}
                        <div
                            className="
                            mt-4
                            flex
                            flex-col
                            gap-3
                        "
                        >
                            <AddressListItem address="12, Ekueme Street, iyana ipaja" />

                            <AddressListItem address="9, Micheal Aransiola Street, Ibafo" />
                        </div>

                        <Button className="capitalize mt-6">
                            add new address
                        </Button>
                    </div>
                </div>

                <div>
                    <Heading className="mt-12">your orders</Heading>

                    {/* order preview list */}
                    <div
                        className="
                        mt-6
                    "
                    >
                        {/* order preview */}
                        <OrderPreview
                            orderId={"sas2j92jsqksm9"}
                            status={"pending"}
                            shippingAddress={
                                "12, Alex ekueme street, iyana ipaja, lagos"
                            }
                            orderDate={"12/5/26"}
                            deliveryDate={"12/5/26"}
                            totalPaid={"$3500"}
                            paymentStatus={"paid"}
                            items={[
                                {
                                    title: "How to win friends and influence people",
                                    quantity: 2,
                                    price: 100,
                                    photoUrl: "https://picsum.photos/id/24/400",
                                },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
