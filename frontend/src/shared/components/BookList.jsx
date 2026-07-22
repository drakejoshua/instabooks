import BookItem from "./BookItem";

function BookList({ books, className = "" }) {
    return <div
        className={`
            grid
            grid-cols-1 lg:grid-cols-3
            gap-12
            ${ className }
        `}
    >
        {
            books?.map( function( book, index ) {
                return <BookItem {...book} key={index} />
            })
        }
    </div>
}

export default BookList;
