const express = require("express")

//Database
const database = require("./database");

//Initialize express
const bookman = express();

/*
Route            /
Description      Get all books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
bookman.get("/",(req,res) => {
  return res.json({books: database.books});
});

/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
bookman.get("/is/:isbn",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
  }

  return res.json({book: getSpecificBook});
});

/*
Route            /c
Description      Get specific book on Category
Access           PUBLIC
Parameter        category
Methods          GET
*/

bookman.get("/c/:category",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  )

  if (getSpecificBook.length === 0) {
    return res.json({error: `No book found for the category of ${req.params.category}`})
  }

  return res.json({book: getSpecificBook});
});

/*
Route            /lang
Description      Get specific book on Language
Access           PUBLIC
Parameter        language
Methods          GET
*/

bookman.get("/lang/:language",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language.includes(req.params.language)
  )

  if (getSpecificBook.length === 0) {
    return res.json({error: `No book found for the language of ${req.params.language}`})
  }

  return res.json({book: getSpecificBook});
});

/*
Route            /author
Description      Get all authors
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

bookman.get("/author", (req,res) => {
  return res.json({authors: database.author});
});

/*
Route            /author/book
Description      Get all authors based on books
Access           PUBLIC
Parameter        isbn
Methods          GET
*/

bookman.get("/author/book/:isbn", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0){
    return res.json({error: `No author found for the book of ${req.params.isbn}`});
  }
  return res.json({authors: getSpecificAuthor});
});

/*
Route            /publications
Description      Get all publications
Access           PUBLIC
Parameter        NONE
Methods          GET
*/

bookman.get("/publications",(req,res) => {
  return res.json({publications: database.publication});
});

bookman.listen(3000,() => {
  console.log("Server is up and running");
});
