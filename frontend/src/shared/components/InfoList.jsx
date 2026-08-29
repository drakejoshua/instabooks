// InfoList component
// This component is responsible for rendering a list of information entries. 
// It accepts an "entries" prop, which is an object containing key-value pairs
// representing the information to be displayed. The component maps through
// the entries and renders each key as a term (dt) and each value as a description (dd).


export function InfoList({ entries, className = "" }) {
    return (
        <div
            className={`
                flex
                flex-col
                gap-1

                *:flex
                *:justify-between

                [&_.important-info]:font-medium

                ${ className }
            `}
        >
            {
                Object.entries( entries ).map( ( [ key, value ] ) => (
                    <dl key={`${key}-${value}`}>
                        <dt className="capitalize">
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