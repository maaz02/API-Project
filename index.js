require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialize express
const bookman = express();

bookman.use(bodyParser.urlencoded({extended: true}));
bookman.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
).then(() => console.log("Connection established"));


/*
Route            /
Description      Get all books
Access           PUBLIC
Parameter        NONE
Methods          GET
*/
bookman.get("/",async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route            /is
Description      Get specific book on ISBN
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
bookman.get("/is/:isbn", async (req,res) => {

const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

//null !0 = 1, !1=0
  if(!getSpecificBook) {
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

bookman.get("/c/:category", async (req,res) => {

const getSpecificBook = await BookModel.findOne({category: req.params.category});

  //null !0 = 1, !1=0
    if(!getSpecificBook) {
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

bookman.get("/author", async (req,res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

/*
Route            /author/id
Description      Get all authors based on id
Access           PUBLIC
Parameter        id
Methods          GET
*/

bookman.get("/author/id/:id", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id === parseInt(req.params.id)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({error: `No author found for the id of ${req.params.id}`});
  }

  return res.json({authors: getSpecificAuthor});
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

bookman.get("/publications",async (req,res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
});

/*
Route            /publications
Description      Get specific Publication by name
Access           PUBLIC
Parameter        name
Methods          GET
*/

bookman.get("/publications/name/:name",(req,res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.name.includes(req.params.name)
  );

  if(getSpecificPublication.length === 0){
    return res.json({error: `No publication found for the book of ${req.params.name}`});
  }
  return res.json({publications: getSpecificPublication});
});

/*
Route            /publication/book
Description      Get all publications based on books
Access           PUBLIC
Parameter        books
Methods          GET
*/

bookman.get("/publications/book/:books", (req,res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.books)
  );

  if(getSpecificPublication.length === 0){
    return res.json({error: `No publication found for the book of ${req.params.books}`});
  }
  return res.json({publications: getSpecificPublication});
});


//POST

/*
Route            /book/new
Description      Add new books
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

bookman.post("/book/new", async (req,res) => {
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book was added"
  });
});

/*
Route            /author/new
Description      Add new authors
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

bookman.post("/author/new", async (req,res) => {
  const { newAuthor } = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);
  return res.json({
    author: addNewAuthor,
    message: "Author was added"
  });
});

/*
Route            /publication/new
Description      Add new publications
Access           PUBLIC
Parameter        NONE
Methods          POST
*/

bookman.post("/publication/new", async (req,res) => {
  const { newPublication } = req.body;
  const addNewPublication = PublicationModel.create(newPublication);
  return res.json({
    publication: addNewPublication,
    message: "Publication was added"
  });
});

/*****************PUT*********************/
/*
Route            /book/update
Description      Update book on isbn
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

bookman.put("/book/update/:isbn",async (req,res) => {
  const updatedBook = await  BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({
    books: updatedBook
  });
});

/********** Updating new author **********/
/*
Route            /book/author/update
Description      Update or add a new author
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

bookman.put("/book/author/update/:isbn", async(req,res) => {
  //Update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      $addToSet: {
        authors: req.body.newAuthor
      }
    },
    {
      new:true
    }
  );

  //Update author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
        id: req.body.newAuthor
    },
    {
      $addToSet: {
        books: req.params.isbn
      }
    },
    {
      new:true
    }
  );

  return res.json(
    {
      books: updatedBook,
      authors: updatedAuthor,
      message: "New author was added"
    }
  );
});













/*
Route            /publication/update/book
Description      Update or add a new publication
Access           PUBLIC
Parameter        isbn
Methods          PUT
*/

bookman.put("/publication/update/book/:isbn", (req,res) => {
  //Update the publication Database
  database.publication.forEach((pub) => {
    if (pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books:database.books,
      publications:database.publication,
      message: "Successfully updated publications"
    }
  );
});

/*****DELETE*****/
/*
Route            /book/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

bookman.delete("/book/delete/:isbn", async (req,res) => {
  //Whichever doesnt match the ISBN just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );

  return res.json({
    books: updatedBookDatabase
  });
});

/*
Route            /author/delete
Description      Delete a book
Access           PUBLIC
Parameter        isbn
Methods          DELETE
*/

bookman.delete("/author/delete/:id", (req,res) => {
  //Whichever doesnt match the ID just send it to an updatedAuthorDatabase array
  //and rest will be filtered out

  const updatedAuthorDatabase = database.author.filter(
    (author) => author.id !== req.params.id
  )
  database.author = updatedAuthorDatabase;

  return res.json({author: database.author});
});

/*
Route            /book/delete/author
Description      Delete an author from a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/

bookman.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
   //Update the book database
   database.books.forEach((book)=>{
     if(book.ISBN === req.params.isbn) {
       const newAuthorList = book.author.filter(
         (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
       );
       book.author = newAuthorList
       return;
     }
   });


   //Update the author database
   database.author.forEach((eachAuthor)=>{
     if(eachAuthor.id === parseInt(req.params.authorId)) {
       const newBookList = eachAuthor.books.filter(
         (book) => book !== req.params.isbn
       );
       eachAuthor.books = newBookList;
       return;
     }
   });

   return res.json({
     book: database.books,
     author: database.author,
     message: "Author was deleted!"
   });
});


bookman.listen(3000,() => {
  console.log("Server is up and running");
});
