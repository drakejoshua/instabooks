import BookItem from "./BookItem";

// BookList component
// This component is responsible for rendering a list of books 
// based on the book item and the books array passed as props. 
// It maps through the books array and renders a BookItem 
// component for each book, passing the book's details as 
// props to the BookItem component. 

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
