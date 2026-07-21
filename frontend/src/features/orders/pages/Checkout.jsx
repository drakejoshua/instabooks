import OrderDetailsItem from "../components/OrderDetailsItem";
import { ToggleGroup } from 'radix-ui'
import Button from "../../../shared/components/Button";

export function Component() {
    return <div className="pb-12">
        <h1
            className="
                text-4xl
                capitalize
                mt-4 lg:mt-0
            "
        >
            checkout
        </h1>

        {/* checkout details */}
        <div
            className="
                mt-8
                grid
                grid-cols-1 lg:grid-cols-[3fr_1fr]
                gap-12
            "
        >
            <div>
                {/* confirmation and shipping info */}
                <div>
                    <h2
                        className="
                            text-2xl
                        "
                    >
                        1. Order confirmation
                    </h2>

                    {/* book list */}
                    <div
                        className="
                            mt-5
                        "
                    >
                        <OrderDetailsItem
                            bookName={"How to win friends and influence people"}
                            quantity={2}
                            price={100}
                            photoUrl={"https://picsum.photos/id/24/400"}
                        />
                        
                        <OrderDetailsItem
                            bookName={"How to win friends and influence people"}
                            quantity={2}
                            price={100}
                            photoUrl={"https://picsum.photos/id/24/400"}
                        />
                    </div>
                </div>

                {/* order summary */}
                <div 
                    className="
                        mt-8
                    "
                >
                    <h2
                        className="
                            text-2xl
                            capitalize
                        "
                    >
                        2. shipping information
                    </h2>

                    <div
                        className="
                            mt-3
                        "
                    >
                        <p
                            className="
                                mt-6
                            "
                        >
                            Choose shipping address: 
                        </p>

                        <ToggleGroup.Root 
                            type="single"
                            defaultValue="0"
                            className="
                                flex
                                gap-2
                                mt-6 lg:mt-4
                                flex-wrap
                                
                                *:data-[state=on]:outline-2
                                *:data-[state=on]:outline-instabooks-blue
                                *:p-4
                                *:rounded-md
                                *:cursor-pointer
                                *:transition
                                *:focus-visible:outline-2
                                *:focus-visible:outline-instabooks-blue
                                *:focus-visible:outline-offset-2
                            "
                        >
                            <ToggleGroup.Item
                                value="0"
                            >
                                9, Micheal aransiola street, ibafo, ogun state
                            </ToggleGroup.Item>
                            
                            <ToggleGroup.Item
                                value="1"   
                            >
                                12, Alex ekueme street, iyana ipaja, lagos state
                            </ToggleGroup.Item>
                        </ToggleGroup.Root>
                    </div>

                    <h3
                        className="
                            capitalize
                            text-xl
                            mt-6
                        "
                    >
                        standard free delivery
                    </h3>
                    
                    <InfoList
                        className="mt-4"
                        entries={{
                            "delivery date": "12/5/26",
                            "delivery fee": "$0"
                        }}
                    />
                </div>
            </div>

            <div>
                <h2
                    className="
                        text-2xl
                        lg:mt-2
                    "
                >
                    Order summary
                </h2>

                <InfoList
                    className="mt-5"
                    entries={{
                        "delivery date": "12/5/26",
                        "total payable": "$3500"
                    }}
                />

                <Button
                    className="
                        mt-12 lg:mt-8
                        capitalize
                        w-full md:w-1/2 lg:w-full
                        mx-auto
                        block
                    "
                >
                    pay now 
                </Button>
            </div>
        </div>
    </div>;
}


function InfoList({ entries, className = "" }) {
    return (
        <div
            className={`
                flex
                flex-col
                gap-1

                *:flex
                *:justify-between
                *:capitalize

                [&_.important-info]:font-medium

                ${ className }
            `}
        >
            {
                Object.entries( entries ).map( ( [ key, value ] ) => (
                    <dl key={`${key}-${value}`}>
                        <dt>
                            { key }
                        </dt>

                        <dd className="important-info">
                            { value }
                        </dd>
                    </dl>
                ))
            }
        </div>
    )
}