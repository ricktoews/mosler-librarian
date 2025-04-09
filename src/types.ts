export interface Book {
    Shelf: string;
    Title: string;
    Author: string;
    ISBN: string;
    Summary?: string;  // Optional, from interpretive queries
    Explanation?: string;   // Optional, from interpretive queries
}

export interface ApiResponse {
    book_data: Book[];
    interstitial_texts: string[];
}