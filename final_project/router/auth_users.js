const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extract isbn parameter from request URL
    const isbn = req.params.isbn;
    let book = books[isbn];  // Retrieve book object associated with isbn
    if (book) {  // Check if book exists
        let review = req.params.review;
        // Update review if provided in request params
        if (review) {
            book["review"] = review;
        }
        books[isbn] = book;  // Update book details in 'books' object
        res.send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
        // Respond if book with specified isbn is not found
        res.send("Unable to find book!");
    }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Extract isbn parameter from request URL
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        // Delete review from book from 'books' object based on provided isbn
        delete books[isbn].review;
    }
    // Send response confirming deletion of review
    let username = req.session.authorization['username']
    res.send(`Reviews from the ISBN ${isbn} posted by the user ${username} are deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
