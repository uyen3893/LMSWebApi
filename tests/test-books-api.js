require('dotenv').config()
const dbbooks = require('../dbbooks')
const assert = require('assert')
const axios = require('axios')
const dbusers = require('../dbusers')

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

    describe('get book by ID', async() => {
        it('2. should return status 200 and the data response correct user when called', async() => {
            let response = await axios.get(`${process.env.API_URL}/books/${book_id}`)
            let apiBook = response.data[0]
            assert.strictEqual(apiBook.id, book_id)
            assert.strictEqual(apiBook.name, name)
            assert.strictEqual(apiBook.isbn, isbn)
            assert.strictEqual(apiBook.author, author)
            assert.strictEqual(apiBook.publisher, publisher)
            assert.strictEqual(apiBook.quantity, quantity)
            assert.strictEqual(apiBook.id_category, id_category)

            assert.strictEqual(response.status, 200)
        })

        it('3. should return status 500 and the data response will give the error message when called with the wrong id format', async() => {
            let response = await axios.get(`${process.env.API_URL}/books/1`).catch(error => {
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
                assert.strictEqual(error.response.status, 500)
            })
        })

        it('4. should return status 200 and the data response will give a null array when called with the wrong id\'s value', async() => {
            let new_id = null;
            if(book_id.charAt(35) == '1') {
                new_id = book_id.substring(0,35) + '2'
            } else {
                new_id = book_id.substring(0,35) + '1'
            }
            let response = await axios.get(`${process.env.API_URL}/books/${new_id}`)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.length, 0)
        })
    })

    describe('create a book', async() => {
        it('5. should return status 201 and the data response will give a correct created id when called', async() => {
            let response = await axios.post(`${process.env.API_URL}/books`, {
                isbn: isbn,
                name: name,
                author: author,
                publisher: publisher,
                quantity: quantity,
                id_category: id_category
            })
            assert.strictEqual(response.status, 201)
            assert.strictEqual(response.data.State, State.SUCCESS)

            let result = await dbbooks.get_book_by_id_async(response.data.createdBookId)
            assert.strictEqual(result.rows[0].isbn, isbn)
            assert.strictEqual(result.rows[0].name, name)
            assert.strictEqual(result.rows[0].author, author)
            assert.strictEqual(result.rows[0].publisher, publisher)
            assert.strictEqual(result.rows[0].quantity, quantity)
            assert.strictEqual(result.rows[0].id_category, id_category)
        })

        it('6.should return status 500 and the State response will be error when called with no parameters', async() => {
            let response = await axios.post(`${process.env.API_URL}/books`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })
        })
    })

    describe('update Book', async() => {
        it('7.should return status 200 and the data in database is the same with the data response when called', async() => {
            const book_isbn = 'jlasdjf9381234'
            const book_name = 'Naruto'
            const book_author = 'Masashi Kishimoto'
            const book_publisher = 'Kim Dong'
            const book_quantity = 230
            const book_id_category = '1c2ad358-98b0-4210-9ea3-3c4625b76e91'
            let response = await axios.put(`${process.env.API_URL}/books/${book_id}`, {
                isbn: book_isbn,
                name: book_name,
                author: book_author,
                publisher: book_publisher,
                quantity: book_quantity,
                id_category: book_id_category
            })
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, State.SUCCESS)

            let result = await dbbooks.get_book_by_id_async(book_id)
            assert.strictEqual(result.rows[0].isbn, book_isbn)
            assert.strictEqual(result.rows[0].name, book_name)
            assert.strictEqual(result.rows[0].author, book_author)
            assert.strictEqual(result.rows[0].publisher, book_publisher)
            assert.strictEqual(result.rows[0].quantity, book_quantity)
            assert.strictEqual(result.rows[0].id_category, book_id_category)
        })

        it('8.should return status 500 and the State response will be error when called with no parameters', async() => {
            let response = await axios.put(`${process.env.API_URL}/books/${book_id}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
                assert.strictEqual(error.response.data.State, State.ERROR)
            })
        })
    })
    
    describe('delete a book', async() => {
        it('9.should return status 200 and delete information of book in the database when called', async() => {
            let response = await axios.delete(`${process.env.API_URL}/books/${book_id}`)
            let result = await dbbooks.get_book_by_id_async(book_id)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.DeletedBookId, book_id)
            assert.strictEqual(response.data.State, State.SUCCESS)
            assert.strictEqual(result.rows.length, 0)
        })

        it('10. should return status 500 and the State response will be error when called with wrong id\'s format', async() => {
            let response = await axios.delete(`${process.env.API_URL}/books/1`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })
        })

        it('11. should return status 500 and the State response will be error when called with id\'s value', async() => {
            let new_id = null
            if(book_id.charAt(35) != 1) {
                new_id = book_id.substring(0,35) + '1'
            } else {
                new_id = book_id.substring(0,35) + '2'
            }
            let response = await axios.delete(`${process.env.API_URL}/books/${new_id}`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, 'Cannot find this book in the database')
            })
        })
    })

    await after(async() => {
        await dbbooks.delete_book_async(book_id)
    })
})