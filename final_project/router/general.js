const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Add the new user to the users array
    users.push({ username, password });

    return res.status(200).json({ message: "User registered successfully" });
  });


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // Use JSON.stringify to convert the books array to a JSON string
    const booksJson = JSON.stringify(books, null, 2);

    // Send the JSON string as the response
    res.status(200).send(booksJson);
  });


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;

    // Find books with the given author
    const authorBooks = Object.values(books).filter(book => book.author === author);

    // If no books are found, return an error
    if (authorBooks.length === 0) {
      return res.status(404).json({ message: "Books by author not found" });
    }

    return res.status(200).json(authorBooks);
  });

// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;

    // Find books with the given title
    const titleBooks = Object.values(books).filter(book => book.title === title);

    // If no books are found, return an error
    if (titleBooks.length === 0) {
      return res.status(404).json({ message: "Books with title not found" });
    }

    return res.status(200).json(titleBooks);
  });

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;

    // Find the book with the given ISBN
    const book = books[isbn];

    // If the book is not found, return an error
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // If the book has no reviews, return a message
    if (!book.reviews || Object.keys(book.reviews).length === 0) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }

    return res.status(200).json(book.reviews);
  });


module.exports.general = public_users;
