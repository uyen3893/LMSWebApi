const dbbooks = require('../dbbooks')
const assert = require('assert')
require('dotenv').config()
const axios = require('axios')
const Pool = require('pg').Pool
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

const State = {
    SUCCESS: "Success",
    ERROR: "Error"
}
const ErrorResponseMessage = "Error occurs when execute query on database"

const isbn = '123456sdfa123'
const name = 'Bleach'
const author = 'Tite Kubo'
const publisher = 'Kim Dong'
const quantity = 145
const id_category = '13fbb02e-9d06-48de-9ff4-276ff5959e1f'

describe('books api', async() => {
    let book_id = null
    before(async() => {
        const result = await dbbooks.create_book_async(isbn, name, author, publisher, quantity, id_category)
        book_id = result.rows[0].new_id
    })

    describe('get books', async() => {
        it('1. should return status 200 and the number of data response is equal to the number of books when called correctly', async() => {
            let response = await axios.get(`${process.env.API_URL}/books`)
            let apiBooksCount = response.data.length
            const result = await dbbooks.count_number_of_books_async()
            const dbBooksCount = result.rows[0].count
            assert.strictEqual(apiBooksCount, parseInt(dbBooksCount))
            assert.strictEqual(response.status, 200)
        })
    })

    await after(async() => {
        await dbbooks.delete_book_async(book_id)
    })
})