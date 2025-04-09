import React, { useState } from 'react';
import './App.css';
import { Book } from './types';

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
      "Author": "Alice Outwater",
      "Explanation": "A coming-of-age memoir that explores themes of identity and growth.",
      "ISBN": "9781250085788",
      "Shelf": "Stand",
      "Summary": "A memoir about the author's journey of self-discovery and healing.",
      "Title": "Wild at Heart"
    },
    {
      "Author": "Alice Outwater",
      "Explanation": "A coming-of-age memoir that explores themes of identity and growth.",
      "ISBN": "9781250085788",
      "Shelf": "Stand",
      "Summary": "A memoir about the author's journey of self-discovery and healing.",
      "Title": "Wild at Heart"
    },
    {
      "Author": "Alice Outwater",
      "Explanation": "A coming-of-age memoir that explores themes of identity and growth.",
      "ISBN": "9781250085788",
      "Shelf": "Stand",
      "Summary": "A memoir about the author's journey of self-discovery and healing.",
      "Title": "Wild at Heart"
    },
    {
      "Author": "Alice Outwater",
      "Explanation": "A coming-of-age memoir that explores themes of identity and growth.",
      "ISBN": "9781250085788",
      "Shelf": "Stand",
      "Summary": "A memoir about the author's journey of self-discovery and healing.",
      "Title": "Wild at Heart"
    },
    {
      "Author": "Alice Outwater",
      "Explanation": "A coming-of-age memoir that explores themes of identity and growth.",
      "ISBN": "9781250085788",
      "Shelf": "Stand",
      "Summary": "A memoir about the author's journey of self-discovery and healing.",
      "Title": "Wild at Heart"
    },
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
      "Author": "Barbara Flanagan",
      "Explanation": "A book that could appeal to fans of adventurous stories.",
      "ISBN": "9780789309891",
      "Shelf": "Shelf A1",
      "Summary": "A guide to houseboating.",
      "Title": "The Houseboat Book"
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
      "Author": "Barbara Flanagan",
      "Explanation": "A book that could appeal to fans of adventurous stories.",
      "ISBN": "9780789309891",
      "Shelf": "Shelf A1",
      "Summary": "A guide to houseboating.",
      "Title": "The Houseboat Book"
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
      "Author": "Barbara Flanagan",
      "Explanation": "A book that could appeal to fans of adventurous stories.",
      "ISBN": "9780789309891",
      "Shelf": "Shelf A1",
      "Summary": "A guide to houseboating.",
      "Title": "The Houseboat Book"
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
      "Author": "Barbara Flanagan",
      "Explanation": "A book that could appeal to fans of adventurous stories.",
      "ISBN": "9780789309891",
      "Shelf": "Shelf A1",
      "Summary": "A guide to houseboating.",
      "Title": "The Houseboat Book"
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
    },
    {
      "Author": "Jan-Philipp Sendker",
      "Explanation": "A novel that deals with themes of identity and growth.",
      "ISBN": "9781590514634",
      "Shelf": "Cart",
      "Summary": "A novel that explores themes of love, family, and identity.",
      "Title": "The Art of Hearing Heartbeats"
    },
    {
      "Author": "Jan-Philipp Sendker",
      "Explanation": "A novel that deals with themes of identity and growth.",
      "ISBN": "9781590514634",
      "Shelf": "Cart",
      "Summary": "A novel that explores themes of love, family, and identity.",
      "Title": "The Art of Hearing Heartbeats"
    },
    {
      "Author": "Jan-Philipp Sendker",
      "Explanation": "A novel that deals with themes of identity and growth.",
      "ISBN": "9781590514634",
      "Shelf": "Cart",
      "Summary": "A novel that explores themes of love, family, and identity.",
      "Title": "The Art of Hearing Heartbeats"
    },
    {
      "Author": "Jan-Philipp Sendker",
      "Explanation": "A novel that deals with themes of identity and growth.",
      "ISBN": "9781590514634",
      "Shelf": "Cart",
      "Summary": "A novel that explores themes of love, family, and identity.",
      "Title": "The Art of Hearing Heartbeats"
    },
    {
      "Author": "Jan-Philipp Sendker",
      "Explanation": "A novel that deals with themes of identity and growth.",
      "ISBN": "9781590514634",
      "Shelf": "Cart",
      "Summary": "A novel that explores themes of love, family, and identity.",
      "Title": "The Art of Hearing Heartbeats"
    },
  ],
  "interstitial_texts": [
    "I couldn't find any books similar to Anne of Green Gables or the series itself in the Mosler Lofts Library list. However, I can suggest some alternative books that might be of interest.",
    "If you're looking for classic coming-of-age stories, you might enjoy \"The Catcher in the Rye\" is not on the list, but \"A Tree Grows in Brooklyn\" is not available either. However, some books that deal with themes of self-discovery and growth are available, such as \"Wild at Heart\" by Alice Outwater (Stand), which is a memoir about the author's journey of self-discovery and healing.",
    "Other books that might be of interest are \"The Houseboat Book\" by Barbara Flanagan (Shelf A1), a guide to houseboating that could appeal to fans of adventurous stories, or \"The Art of Hearing Heartbeats\" by Jan-Philipp Sendker (Cart), a novel that explores themes of love, family, and identity."
  ],
  "preface": ""
};

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [text, setText] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setText([]);
    setBooks([]);

    // Sort books by Shelf, then Title
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

  // Group books by shelf for rendering
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about our books..."
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {text.length > 0 && <div className="interstitial">{text.map((t, n) => <p key={n}>{t}</p>)}</div>}
      {books.length > 0 ? (
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
      ) : (
        <p>No books found yet.</p>
      )}
    </div>
  );
};

export default App;