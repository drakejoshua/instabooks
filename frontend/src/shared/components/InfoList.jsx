export function InfoList({ entries, className = "" }) {
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