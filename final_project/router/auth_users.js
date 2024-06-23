const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

let users = [];

const isValid = (username) => {
  if (!username) {
    return false;
  }
  const user = users.find(user => user.username === username);
  return !user;
}

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return !!user;
}

const regd_users = express.Router();

regd_users.use(express.json()); 

regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });

  return res.status(200).json({ message: 'Customer successfully logged in', token });
});

regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review; 

  if (!isbn || !review) {
    return res.status(400).json({ message: 'ISBN and review are required' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const username = req.user.username;
  console.log(`username is ${username}`);

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: 'Review added/updated successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
