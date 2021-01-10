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
  //app.get('/categories', queryCategories.get_categories_method)
  app.get('/categories', queryCategories.get_categories_method_async)
  //app.get('/categories/:id', queryCategories.get_category_by_id_method)
  app.get('/categories/:id', queryCategories.get_category_by_id_method_async)
  //app.post('/categories', queryCategories.create_category_method)
  app.post('/categories', queryCategories.create_category_method_async)
  //app.put('/categories/:id', queryCategories.update_category_method)
  app.put('/categories/:id', queryCategories.update_category_method_async)
  //app.delete('/categories/:id', queryCategories.delete_category_method)
  app.delete('/categories/:id', queryCategories.delete_category_method_async)
  
  //API of bookchecks
  //app.get('/bookchecks', queryBookChecks.get_bookchecks_method)
  app.get('/bookchecks', queryBookChecks.get_bookchecks_method_async) 
  //app.get('/bookchecks/:id', queryBookChecks.get_bookcheck_by_id_method)
  app.get('/bookchecks/:id', queryBookChecks.get_bookcheck_by_id_method_async)
  //app.post('/bookchecks', queryBookChecks.create_bookcheck_method)
  app.post('/bookchecks', queryBookChecks.create_bookcheck_method_async)
  //app.put('/bookchecks/:id', queryBookChecks.update_bookcheck_method)
  app.put('/bookchecks/:id', queryBookChecks.update_bookcheck_method_async)
  //app.delete('/bookchecks/:id', queryBookChecks.delete_bookcheck_method)
  app.delete('/bookchecks/:id', queryBookChecks.delete_bookcheck_method_async)
  
  //API of reports
  //app.get('/reports/numberofusers', queryReports.get_number_of_users_method)
  app.get('/reports/numberofusers', queryReports.get_number_of_users_method_async)
  //app.get('/reports/numberofusersbygender', queryReports.get_number_of_users_by_gender_method)
  app.get('/reports/numberofusersbygender', queryReports.get_number_of_users_by_gender_method_async)
  //app.get('/reports/numberofbooks', queryReports.get_number_of_books_method)
  app.get('/reports/numberofbooks', queryReports.get_number_of_books_method_async)
  //app.get('/reports/numberofborrowedbooks', queryReports.get_number_of_borrowed_books_method)
  app.get('/reports/numberofborrowedbooks', queryReports.get_number_of_borrowed_books_method_async)
  //app.get('/reports/numberofbooksbycategories', queryReports.get_number_of_books_by_categories_method)
  app.get('/reports/numberofbooksbycategories', queryReports.get_number_of_books_by_categories_method_async)

