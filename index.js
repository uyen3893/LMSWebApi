const express = require('express')
const bodyParser = require('body-parser')
const queryUsers = require('./queryusers')
const queryBooks = require('./querybooks')
const queryCategories = require('./querycategories')
const queryBookChecks = require('./querybookchecks')
const queryReports = require('./queryreports')
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
  app.get('/users', queryUsers.getUsersAsync)
  //app.get('/users', queryUsers.getUsers)
  //app.get('/users/:id', queryUsers.getUserByID)
  app.get('/users/:id', queryUsers.getUserByIDAsync)
  //app.post('/users', queryUsers.createUser)
  app.post('/users', queryUsers.createUserAsync)
  //app.put('/users/:id', queryUsers.updateUser)
  app.put('/users/:id', queryUsers.updateUserAsync)
  //app.delete('/users/:id', queryUsers.deleteUser)
  app.delete('/users/:id', queryUsers.deleteUserAsync)
  
  //API of books
  // app.get('/books', queryBooks.getBooks)
  app.get('/books', queryBooks.getBooksAsync)
  //app.get('/books/:id', queryBooks.getBookByID)
  app.get('/books/:id', queryBooks.getBookByIDAsync)
  //app.post('/books', queryBooks.createBook)
  app.post('/books', queryBooks.createBookAsync)
  //app.put('/books/:id', queryBooks.updateBook)
  app.put('/books/:id', queryBooks.updateBookAsync)
  //app.delete('/books/:id', queryBooks.deleteBook)
  app.delete('/books/:id', queryBooks.deleteBookAsync)

  //API of categories
  //app.get('/categories', queryCategories.getCategories)
  app.get('/categories', queryCategories.getCategoriesAsync)
  //app.get('/categories/:id', queryCategories.getCategoryByID)
  app.get('/categories/:id', queryCategories.getCategoryByIDAsync)
  //app.post('/categories', queryCategories.createCategory)
  app.post('/categories', queryCategories.createCategoryAsync)
  //app.put('/categories/:id', queryCategories.updateCategory)
  app.put('/categories/:id', queryCategories.updateCategoryAsync)
  //app.delete('/categories/:id', queryCategories.deleteCategory)
  app.delete('/categories/:id', queryCategories.deleteCategoryAsync)

  //API of bookchecks
  //app.get('/bookchecks', queryBookChecks.getBookChecks)
  app.get('/bookchecks', queryBookChecks.getBookChecksAsync) 
  //app.get('/bookchecks/:id', queryBookChecks.getBookChecksByID)
  app.get('/bookchecks/:id', queryBookChecks.getBookcheckByIDAsync)
  //app.post('/bookchecks', queryBookChecks.createBookCheck)
  app.post('/bookchecks', queryBookChecks.createBookCheckAsync)
  //app.put('/bookchecks/:id', queryBookChecks.updateBookCheck)
  app.put('/bookchecks/:id', queryBookChecks.updateBookCheckAsync)
  //app.delete('/bookchecks/:id', queryBookChecks.deleteBookCheck)
  app.delete('/bookchecks/:id', queryBookChecks.deleteBookCheckAsync)

  //API of reports
  //app.get('/reports/numberofusers', queryReports.getNumberOfUsers)
  app.get('/reports/numberofusers', queryReports.getNumberOfUsersAsync)
  //app.get('/reports/numberofusersbygender', queryReports.getNumberOfUsersByGender)
  app.get('/reports/numberofusersbygender', queryReports.getNumberOfUsersByGenderAsync)
  //app.get('/reports/numberofbooks', queryReports.getNumberOfBooks)
  app.get('/reports/numberofbooks', queryReports.getNumberOfBooksAsync)
  //app.get('/reports/numberofborrowedbooks', queryReports.getNumberOfBorrowedBooks)
  app.get('/reports/numberofborrowedbooks', queryReports.getNumberOfBorrowedBooksAsync)
  //app.get('/reports/numberofbooksbycategories', queryReports.getNumberOfBooksByCategories)
  app.get('/reports/numberofbooksbycategories', queryReports.getNumberOfBooksByCategoriesAsync)

