const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const port = 3000

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

  app.get('/users', db.getUsers)
  app.get('/users/:id', db.getUserByID)
  app.post('/users', db.createUser)
  app.put('/users/:id', db.updateUser)
  app.delete('/users/:id', db.deleteUser)
  app.get('/books', db.getBooks)
  app.get('/books/:id', db.getBookByID)
  app.post('/books', db.createBook)
  app.put('/books/:id', db.updateBook)
  app.delete('/books/:id', db.deleteBook)
