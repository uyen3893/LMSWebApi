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
  app.get('/users', queryUsers.get_users_method_async)
  //app.get('/users', queryUsers.get_users_method)
  //app.get('/users/:id', queryUsers.get_user_by_id_method)
  app.get('/users/:id', queryUsers.get_user_by_id_method_async)
  //app.post('/users', queryUsers.create_user_method)
  app.post('/users', queryUsers.create_user_method_async)
  //app.put('/users/:id', queryUsers.update_user_method)
  app.put('/users/:id', queryUsers.update_user_method_async)
  //app.delete('/users/:id', queryUsers.delete_user_method)
  app.delete('/users/:id', queryUsers.delete_user_method_async)
  
  //API of books
  //app.get('/books', queryBooks.get_books_method)
  app.get('/books', queryBooks.get_book_method_async)
  //app.get('/books/:id', queryBooks.get_book_by_id_method)
  app.get('/books/:id', queryBooks.get_book_by_id_method_async)
  //app.post('/books', queryBooks.create_book_method)
  app.post('/books', queryBooks.create_book_method_async)
  //app.put('/books/:id', queryBooks.update_book_method)
  app.put('/books/:id', queryBooks.update_book_method_async)
  //app.delete('/books/:id', queryBooks.delete_book_method)
  app.delete('/books/:id', queryBooks.delete_book_method_async)

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

