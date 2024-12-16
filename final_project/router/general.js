const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user. Username or password not provided"});
});

//Creating a promise method
let promiseTask10 = new Promise((resolve,reject) => {
    // Send JSON response with formatted general data
    resolve(JSON.stringify(books,null,10))
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Call the promise and wait for it to be resolved and then send the JSON.
    promiseTask10.then((successMessage) => {
        res.send(successMessage);
    })
});

//Creating a promise method
let promiseTask11 = new Promise((resolve,reject) => {
    resolve(books)
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    //Call the promise and wait for it to be resolved and then send the book details.
    promiseTask11.then((successMessage) => {
        res.send(successMessage[isbn]);
    })
});
  
//Creating a promise method
let promiseTask12 = new Promise((resolve,reject) => {
    resolve(books)
})

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Extract the author parameter from the request URL
    const author = req.params.author;
    promiseTask12.then((successMessage) => {
        for (let i = 1; i <= 10; i++) {
            if (successMessage[i].author === author) {
                let booksbyauthor = {
                    "booksbyauthor": [
                        {
                            "isbn": i,
                            "title": successMessage[i].title,
                            "reviews": {}
                        }
                    ]
                }
                res.send(booksbyauthor);
            }
        }
    })
});

//Creating a promise method
let promiseTask13 = new Promise((resolve,reject) => {
    resolve(books)
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Extract the title parameter from the request URL
    const title = req.params.title;
    promiseTask13.then((successMessage) => {
        for (let i = 1; i <= 10; i++) {
            if (successMessage[i].title === title) {
                let booksbytitle = {
                    "booksbytitle": [
                        {
                            "isbn": i,
                            "author": successMessage[i].author,
                            "reviews": {}
                        }
                    ]
                }
                res.send(booksbytitle);
            }
        }
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
