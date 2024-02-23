const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Write code to check if the username is valid
  return true; // For demonstration purposes, always return true
}

const authenticatedUser = (username, password) => {
  // Write code to check if username and password match the one we have in records
  return true; // For demonstration purposes, always return true
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if the username is valid
    if (!isValid(username)) {
      return res.status(400).json({ message: "Invalid username" });
    }

    // Check if the username and password match
    if (!authenticatedUser(username, password)) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ username: username }, "your_secret_key_here");

    return res.status(200).json({ token: token });
  });


// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;

    // Verify the JWT token to get the username
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your_secret_key_here");
    const username = decoded.username;

    // Find the book with the given ISBN
    const bookIndex = books.findIndex(book => book.isbn === isbn);

    // If the book is not found, return an error
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already reviewed the book
    const existingReviewIndex = books[bookIndex].reviews.findIndex(review => review.username === username);

    if (existingReviewIndex !== -1) {
      // Modify the existing review
      books[bookIndex].reviews[existingReviewIndex].review = review;
    } else {
      // Add a new review
      books[bookIndex].reviews.push({ username, review });
    }

    return res.status(200).json({ message: "Review added/modified successfully" });
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    // Verify the JWT token to get the username
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your_secret_key_here");
    const username = decoded.username;

    // Find the book with the given ISBN
    const bookIndex = books.findIndex(book => book.isbn === isbn);

    // If the book is not found, return an error
    if (bookIndex === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Find the index of the review by the current user
    const reviewIndex = books[bookIndex].reviews.findIndex(review => review.username === username);

    // If the review is not found, return an error
    if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Remove the review
    books[bookIndex].reviews.splice(reviewIndex, 1);

    return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
