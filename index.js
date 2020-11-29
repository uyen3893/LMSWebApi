const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const port = process.env.API_PORT

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })
  //API of users
  app.get('/users', db.getUsersAsync)
  //app.get('/users', db.getUsers)
  app.get('/users/:id', db.getUserByID)
  // app.get('/users/:id', db.getUserByIDAsync)
  app.post('/users', db.createUser)
  //app.post('/users', db.createUserAsync)
  //app.put('/users/:id', db.updateUser)
  app.put('/users/:id', db.updateUserAsync)
  //app.delete('/users/:id', db.deleteUser)
  app.delete('/users/:id', db.deleteUserAsync)
  
  //API of books
  // app.get('/books', db.getBooks)
  app.get('/books', db.getBooksAsync)
  app.get('/books/:id', db.getBookByID)
  //app.get('/books/:id', db.getBookByIDAsync)
  //app.post('/books', db.createBook)
  app.post('/books', db.createBookAsync)
  //app.put('/books/:id', db.updateBook)
  app.put('/books/:id', db.updateBookAsync)
  //app.delete('/books/:id', db.deleteBook)
  app.delete('/books/:id', db.deleteBookAsync)

  //API of categories
  //app.get('/categories', db.getCategories)
  app.get('/categories', db.getCategoriesAsync)
  //app.get('/categories/:id', db.getCategoryByID)
  app.get('/categories/:id', db.getCategoryByIDAsync)
  //app.post('/categories', db.createCategory)
  app.post('/categories', db.createCategoryAsync)
  app.put('/categories/:id', db.updateCategory)
  //app.put('/categories/:id', db.updateCategoryAsync)
  app.delete('/categories/:id', db.deleteCategory)
  //app.delete('/categories/:id', db.deleteCategoryAsync)

  //API of bookchecks
  app.get('/bookchecks', db.getBookChecks)
  //app.get('/bookchecks', db.getBookChecksAsync) 
  app.get('/bookchecks/:id', db.getBookChecksByID)
  //app.get('/bookchecks/:id', db.getBookcheckByIDAsync)
  //app.post('/bookchecks', db.createBookCheck)
  app.post('/bookchecks', db.createBookCheckAsync)
  //app.put('/bookchecks/:id', db.updateBookCheck)
  app.put('/bookchecks/:id', db.updateBookCheckAsync)
  app.delete('/bookchecks/:id', db.deleteBookCheck)
  //app.delete('/bookchecks/:id', db.deleteBookCheckAsync)

  //API of reports
  //app.get('/reports/numberofusers', db.getNumberOfUsers)
  app.get('/reports/numberofusers', db.getNumberOfUsersAsync)
  app.get('/reports/numberofusersbygender', db.getNumberOfUsersByGender)
  //app.get('/reports/numberofusersbygender', db.getNumberOfUsersByGenderAsync)
  //app.get('/reports/numberofbooks', db.getNumberOfBooks)
  app.get('/reports/numberofbooks', db.getNumberOfBooksAsync)
  //app.get('/reports/numberofborrowedbooks', db.getNumberOfBorrowedBooks)
  app.get('/reports/numberofborrowedbooks', db.getNumberOfBorrowedBooksAsync)
  //app.get('/reports/numberofbooksbycategories', db.getNumberOfBooksByCategories)
  app.get('/reports/numberofbooksbycategories', db.getNumberOfBooksByCategoriesAsync)

