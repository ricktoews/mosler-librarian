import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Book } from './types';
import { FaSearch } from 'react-icons/fa'; // Import magnifying glass icon from react-icons

const FaSearchTyped = FaSearch as () => React.JSX.Element;

const App: React.FC = () => {
  const [titleQuery, setTitleQuery] = useState<string>('');
  const [authorQuery, setAuthorQuery] = useState<string>('');
  const [freeformQuery, setFreeformQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[] | null>(null);
  const [text, setText] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'both' | 'simple' | 'freeform'>('both');

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://mosler-library.toews-api.com:5000/get-books/');
      const booksData: Book[] = response.data;
      setAllBooks(booksData);
      return booksData;
    } catch (err) {
      setError('Failed to fetch books data. Please try again.');
      console.error('Error fetching books:', err);
      return null;
    }
  };

  const handleTitleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'title') setTitleQuery(value);
    if (name === 'author') setAuthorQuery(value);

    const updatedTitle = name === 'title' ? value : titleQuery;
    const updatedAuthor = name === 'author' ? value : authorQuery;
    if (updatedTitle || updatedAuthor) {
      setSearchMode('simple');
    } else if (!updatedTitle && !updatedAuthor && !freeformQuery) {
      setSearchMode('both');
    }
  };

  const handleFreeformChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFreeformQuery(value);

    if (value) {
      setSearchMode('freeform');
    } else if (!value && !titleQuery && !authorQuery) {
      setSearchMode('both');
    }
  };

  const handleTitleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setText([]);
    setBooks([]);

    let booksData = allBooks;
    if (!booksData) {
      booksData = await fetchBooks();
    }

    if (booksData) {
      const filteredBooks = booksData.filter(book => {
        const matchesTitle = titleQuery ? book.Title.toLowerCase().includes(titleQuery.toLowerCase()) : true;
        const matchesAuthor = authorQuery ? book.Author.toLowerCase().includes(authorQuery.toLowerCase()) : true;
        return matchesTitle && matchesAuthor;
      }).sort((a, b) => {
        if (a.Shelf === b.Shelf) {
          return a.Title.localeCompare(b.Title);
        }
        return a.Shelf.localeCompare(b.Shelf);
      });

      setBooks(filteredBooks);
    }
  };

  const handleFreeformSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setText([]);
    setBooks([]);

    const SAMPLE_PAYLOAD = {
      "book_data": [
        {
          "Author": "Alice Outwater",
          "Explanation": "A coming-of-age memoir that explores themes of identity and growth.",
          "ISBN": "9781250085788",
          "Shelf": "Stand",
          "Summary": "A memoir about the author's journey of self-discovery and healing.",
          "Title": "Wild at Heart"
        },
        {
          "Author": "Barbara Flanagan",
          "Explanation": "A book that could appeal to fans of adventurous stories.",
          "ISBN": "9780789309891",
          "Shelf": "Shelf A1",
          "Summary": "A guide to houseboating.",
          "Title": "The Houseboat Book"
        },
        {
          "Author": "Jan-Philipp Sendker",
          "Explanation": "A novel that deals with themes of identity and growth.",
          "ISBN": "9781590514634",
          "Shelf": "Cart",
          "Summary": "A novel that explores themes of love, family, and identity.",
          "Title": "The Art of Hearing Heartbeats"
        }
      ],
      "interstitial_texts": [
        "I couldn't find any books similar to Anne of Green Gables...",
        "If you're looking for classic coming-of-age stories...",
        "Other books that might be of interest are..."
      ],
      "preface": ""
    };

    const sortedBooks = [...SAMPLE_PAYLOAD.book_data].sort((a, b) => {
      if (a.Shelf === b.Shelf) {
        return a.Title.localeCompare(b.Title);
      }
      return a.Shelf.localeCompare(b.Shelf);
    });

    setBooks(sortedBooks);
    if (SAMPLE_PAYLOAD.interstitial_texts?.length > 0) {
      setText(SAMPLE_PAYLOAD.interstitial_texts);
    }
  };

  const groupedBooks = books.reduce((acc, book) => {
    if (!acc[book.Shelf]) {
      acc[book.Shelf] = [];
    }
    acc[book.Shelf].push(book);
    return acc;
  }, {} as { [key: string]: Book[] });

  return (
    <div className="App">
      <div className="header">
        <h1>Mosler Lofts Librarian</h1>
      </div>
      <div className="content">
        <div className={`search-container ${searchMode}`}>
          <form onSubmit={handleTitleAuthorSubmit} className="simple-search">
            <input
              type="text"
              name="title"
              value={titleQuery}
              onChange={handleTitleAuthorChange}
              placeholder="Title"
            />
            <input
              type="text"
              name="author"
              value={authorQuery}
              onChange={handleTitleAuthorChange}
              placeholder="Author"
            />
            <button type="submit" aria-label="Search">
              <FaSearchTyped />
            </button>
          </form>
          <hr className="search-divider" />
          <form onSubmit={handleFreeformSubmit} className="freeform-search">
            <textarea
              value={freeformQuery}
              onChange={handleFreeformChange}
              placeholder="Ask about our books... (e.g., 'I enjoyed An Unkindness of Magicians for its writing style and magic. What’s similar?')"
              rows={2}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        {error && <p className="error">{error}</p>}
        {text.length > 0 && <div className="interstitial">{text.map((t, n) => <p key={n}>{t}</p>)}</div>}
        {books.length > 0 && (
          <div className="results">
            {Object.entries(groupedBooks).map(([shelf, shelfBooks]) => (
              <div key={shelf} className="shelf-group">
                <div className="shelf-header">{shelf}</div>
                <div className="book-list">
                  {shelfBooks.map((book, index) => (
                    <div key={index} className="book-item">
                      <div className="book-title">{book.Title}. <span className="book-author">{book.Author}</span></div>
                      <div className="book-summary">{book.Summary || 'N/A'}</div>
                      <div className="book-reason">{book.Explanation || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;