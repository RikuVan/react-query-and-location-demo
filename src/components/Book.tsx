import './book.css'

import * as React from 'react'

import { Book as BookModel } from '../Books'

export const Book = React.forwardRef(
  ({ book }: { book: BookModel }, ref: React.ForwardedRef<HTMLLIElement> | null) => {
    return (
      <li className="book-card" ref={ref}>
        {book.cover_i ? (
          <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`} alt="" />
        ) : (
          <div className="placeholder" />
        )}
        <div>
          <a href={`https://openlibrary.org/${book.key}`}>{`${book.title}`}</a>
          <p>{`${book.publisher} (${book.first_publish_year})`}</p>
        </div>
      </li>
    )
  }
)
