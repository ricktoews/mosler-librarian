import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { Book } from './types';

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
  const [searchMode, setSearchMode] = useState<'all' | 'title' | 'author' | 'freeform'>('all');
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitleQuery(value);
    if (value && searchMode !== 'title') setSearchMode('title');
    else if (!value && !authorQuery && !freeformQuery) setSearchMode('all');
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAuthorQuery(value);
    if (value && searchMode !== 'author') setSearchMode('author');
    else if (!value && !titleQuery && !freeformQuery) setSearchMode('all');
  };

  const handleFreeformChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFreeformQuery(value);
    if (value && searchMode !== 'freeform') setSearchMode('freeform');
    else if (!value && !titleQuery && !authorQuery) setSearchMode('all');
  };

  const handleTitleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (hasSearched) {
      setTitleQuery('');
      setAuthorQuery('');
      setFreeformQuery('');
      setHasSearched(false);
    }
  };

  const handleAuthorFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (hasSearched) {
      setTitleQuery('');
      setAuthorQuery('');
      setFreeformQuery('');
      setHasSearched(false);
    }
  };

  const handleFreeformFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (hasSearched) {
      setTitleQuery('');
      setAuthorQuery('');
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
    setSearchMode('all');
    setHasSearched(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setText([]);
    setBooks([]);
    setHasSearched(true);

    if (titleQuery || authorQuery) {
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
    } else if (freeformQuery) {
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
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-field title-field">
              <input
                type="text"
                name="title"
                value={titleQuery}
                onChange={handleTitleChange}
                onFocus={handleTitleFocus}
                placeholder="Title"
              />
            </div>
            <hr className="search-divider" />
            <div className="search-field author-field">
              <input
                type="text"
                name="author"
                value={authorQuery}
                onChange={handleAuthorChange}
                onFocus={handleAuthorFocus}
                placeholder="Author"
              />
            </div>
            <hr className="search-divider" />
            <div className="search-field freeform-field">
              <textarea
                value={freeformQuery}
                onChange={handleFreeformChange}
                onFocus={handleFreeformFocus}
                placeholder="Ask about our books... (e.g., 'I enjoyed An Unkindness of Magicians for its writing style and magic. What’s similar?')"
                rows={2}
              />
            </div>
            <button type="submit" className="search-button">Search</button>
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