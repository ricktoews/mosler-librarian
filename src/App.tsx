import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Book } from './types';
import { FaSearch } from 'react-icons/fa';

const FaSearchTyped = FaSearch as () => React.JSX.Element;

const BASE = 'https://mosler-library.toews-api.com:5000';
const API = {
  getBooks: `${BASE}/get-books/`,
  query: `${BASE}/query`
};

const App: React.FC = () => {
  const [titleQuery, setTitleQuery] = useState<string>('');
  const [authorQuery, setAuthorQuery] = useState<string>('');
  const [freeformQuery, setFreeformQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [allBooks, setAllBooks] = useState<Book[] | null>(null);
  const [text, setText] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'both' | 'simple' | 'freeform'>('both');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API.getBooks);
      const booksData: Book[] = response.data;
      setAllBooks(booksData);
      return booksData;
    } catch (err) {
      setError('Failed to fetch books data. Please try again.');
      console.error('Error fetching books:', err);
      return null;
    }
  };

  const fetchQuery = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        API.query,
        { prompt: query },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { book_data, interstitial_texts } = response.data;
      return { books: book_data as Book[], text: interstitial_texts || [] };
    } catch (err) {
      setError('Failed to fetch query results. Please try again.');
      console.error('Error fetching query:', err);
      return null;
    } finally {
      setIsLoading(false);
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

  const handleTitleAuthorFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (hasSearched) {
      setTitleQuery('');
      setAuthorQuery('');
      setHasSearched(false);
    }
  };

  const handleFreeformFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (hasSearched) {
      setFreeformQuery('');
      setHasSearched(false);
    }
  };

  const handleReset = () => {
    setTitleQuery('');
    setAuthorQuery('');
    setFreeformQuery('');
    setBooks([]);
    setText([]);
    setError(null);
    setSearchMode('both');
    setHasSearched(false);
  };

  const handleTitleAuthorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setText([]);
    setBooks([]);
    setHasSearched(true);

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

  const handleFreeformSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setText([]);
    setBooks([]);
    setHasSearched(true);

    if (freeformQuery) {
      const result = await fetchQuery(freeformQuery);
      if (result) {
        const validBooks = result.books.filter(book =>
          book.Shelf !== undefined && book.Shelf !== null &&
          book.Title !== undefined && book.Title !== null
        );
        const sortedBooks = [...validBooks].sort((a, b) => {
          if (a.Shelf === b.Shelf) {
            return a.Title.localeCompare(b.Title);
          }
          return a.Shelf.localeCompare(b.Shelf);
        });
        setBooks(sortedBooks);
        setText(result.text);
      }
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
              onFocus={handleTitleAuthorFocus}
              placeholder="Title"
            />
            <input
              type="text"
              name="author"
              value={authorQuery}
              onChange={handleTitleAuthorChange}
              onFocus={handleTitleAuthorFocus}
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
              onFocus={handleFreeformFocus}
              placeholder="Ask about our books... (e.g., 'I enjoyed An Unkindness of Magicians for its writing style and magic. What’s similar?')"
              rows={2}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        {isLoading && <div className="spinner"></div>}
        {error && <p className="error">{error}</p>}
        {hasSearched && books.length === 0 && !isLoading && !error && (
          <p className="no-results">
            No books found for "{titleQuery || authorQuery || freeformQuery}". Try a different search!
          </p>
        )}
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
        {(hasSearched || books.length > 0 || text.length > 0 || error) && (
          <button className="reset-button" onClick={handleReset}>
            New Search
          </button>
        )}
      </div>
    </div>
  );
};

export default App;