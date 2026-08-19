import BookItem from "./BookItem";

function BookList({ books, className = "", type = "default" }) {
    return <div
        className={`
            grid
            grid-cols-1 lg:grid-cols-3
            gap-12
            ${ className }
        `}
    >
        {
            books?.map( function( book ) {
                return <BookItem 
                    key={book.id} 
                    type={type} 
                    {...book}
                />
            })
        }
    </div>
}

export default BookList;
