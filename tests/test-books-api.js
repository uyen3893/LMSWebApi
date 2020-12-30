require('dotenv').config()
const dbbooks = require('../dbbooks')
const assert = require('assert')
const axios = require('axios')
const dbusers = require('../dbusers')
const dbcategories = require('../dbcategories')
const message = require('../message')


const isbn = '123456sdfa123'
const name = 'Bleach'
const author = 'Tite Kubo'
const publisher = 'Kim Dong'
const quantity = 145
const wrong_id = '00000000-0000-0000-0000-000000000000'
let book_id_for_create_testcase = null
const category_name = 'Testing'

const book_isbn = 'jlasdjf9381234'
const book_name = 'Naruto'
const book_author = 'Masashi Kishimoto'
const book_publisher = 'Kim Dong'
const book_quantity = 230

describe('books api', async() => {
    let book_id = null
    let book_id_for_update_testcase = null
    let book_id_for_delete_testcase = null
    let category_id = null
    let category_id_for_update_testcase = null
    before(async() => {
        const new_category = await dbcategories.create_category_async(category_name)
        const category_result = await dbcategories.get_category_by_name(category_name)
        category_id = category_result.rows[0].id
        const new_category_for_update_testcase = await dbcategories.create_category_async(category_name)
        const category_result_for_update_testcase = await dbcategories.get_category_by_name(category_name)
        category_id_for_update_testcase = category_result_for_update_testcase.rows[0].id
        const result = await dbbooks.create_book_async(isbn, name, author, publisher, quantity, category_id)
        book_id = result.rows[0].new_id
        const result_for_update = await dbbooks.create_book_async(isbn, name, author, publisher, quantity, category_id)
        book_id_for_update_testcase = result_for_update.rows[0].new_id
        const result_for_delete = await dbbooks.create_book_async(isbn, name, author, publisher, quantity, category_id)
        book_id_for_delete_testcase = result_for_delete.rows[0].new_id
    })

    describe('get books', async() => {
        it('1. should return status 200 and the number of data response is equal to the number of books when called correctly', async() => {
            let response = await axios.get(`${process.env.API_URL}/books`)
            let api_books_count = response.data.length
            const result = await dbbooks.count_number_of_books_async()
            const db_books_count = result.rows[0].count
            assert.strictEqual(api_books_count, parseInt(db_books_count))
            assert.strictEqual(response.status, 200)
        })
    })

    describe('get book by ID', async() => {
        it('2. should return status 200 and the data response correct user when called', async() => {
            let response = await axios.get(`${process.env.API_URL}/books/${book_id}`)
            let api_book = response.data[0]
            assert.strictEqual(api_book.id, book_id)
            assert.strictEqual(api_book.name, name)
            assert.strictEqual(api_book.isbn, isbn)
            assert.strictEqual(api_book.author, author)
            assert.strictEqual(api_book.publisher, publisher)
            assert.strictEqual(api_book.quantity, quantity)
            assert.strictEqual(api_book.id_category, category_id)

            assert.strictEqual(response.status, 200)
        })

        it('3. should return status 500 and the data response will give the error message when called with the wrong id format', async() => {
            let response = await axios.get(`${process.env.API_URL}/books/1`).catch(error => {
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message)
                assert.strictEqual(error.response.status, 500)
            })
        })

        it('4. should return status 200 and the data response will give a null array when called with the wrong id\'s value', async() => {
            let response = await axios.get(`${process.env.API_URL}/books/${wrong_id}`)
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
                id_category: category_id
            })
            assert.strictEqual(response.status, 201)
            assert.strictEqual(response.data.State, message.State.SUCCESS)
            book_id_for_create_testcase = response.data.Created_book_id

            let result = await dbbooks.get_book_by_id_async(book_id_for_create_testcase)
            assert.strictEqual(result.rows[0].isbn, isbn)
            assert.strictEqual(result.rows[0].name, name)
            assert.strictEqual(result.rows[0].author, author)
            assert.strictEqual(result.rows[0].publisher, publisher)
            assert.strictEqual(result.rows[0].quantity, quantity)
            assert.strictEqual(result.rows[0].id_category, category_id)
        })

        it('6.should return status 500 and the State response will be error when called with no parameters', async() => {
            let response = await axios.post(`${process.env.API_URL}/books`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message)
            })
        })
    })

    describe('update Book', async() => {
        it('7.should return status 200 and the data in database is the same with the data response when called', async() => {
            let response = await axios.put(`${process.env.API_URL}/books/${book_id_for_update_testcase}`, {
                isbn: book_isbn,
                name: book_name,
                author: book_author,
                publisher: book_publisher,
                quantity: book_quantity,
                id_category: category_id_for_update_testcase
            })
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, message.State.SUCCESS)

            let result = await dbbooks.get_book_by_id_async(book_id_for_update_testcase)
            assert.strictEqual(result.rows[0].isbn, book_isbn)
            assert.strictEqual(result.rows[0].name, book_name)
            assert.strictEqual(result.rows[0].author, book_author)
            assert.strictEqual(result.rows[0].publisher, book_publisher)
            assert.strictEqual(result.rows[0].quantity, book_quantity)
            assert.strictEqual(result.rows[0].id_category, category_id_for_update_testcase)
        })

        it('8.should return status 500 and the State response will be error when called with no parameters', async() => {
            let response = await axios.put(`${process.env.API_URL}/books/${book_id_for_update_testcase}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.Error_message, message.invalid_error_message)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
            })
        })

        it('9. should return status 500 and the State response will be error when called with a wrong id category\'s value', async() => {
            let response = await axios.put(`${process.env.API_URL}/books/${book_id_for_update_testcase}`, {
                isbn: book_isbn,
                name: book_name,
                author: book_author,
                publisher: book_publisher,
                quantity: book_quantity,
                id_category: wrong_id
            }).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.Error_message, message.invalid_error_message)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
            })
        })

        it('10. should return status 500 and the State response will be error when called with a wrong id book\'s value', async() => {
            let response = await axios.put(`${process.env.API_URL}/books/${wrong_id}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.Error_message, message.error_message_while_finding_an_entity('book'))
                assert.strictEqual(error.response.data.State, message.State.ERROR)
            })
        })
    })
    
    describe('delete a book', async() => {
        it('11.should return status 200 and delete information of book in the database when called', async() => {
            let response = await axios.delete(`${process.env.API_URL}/books/${book_id_for_delete_testcase}`)
            let result = await dbbooks.get_book_by_id_async(book_id_for_delete_testcase)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.Deleted_book_id, book_id_for_delete_testcase)
            assert.strictEqual(response.data.State, message.State.SUCCESS)
            assert.strictEqual(result.rows.length, 0)
        })

        it('12. should return status 500 and the State response will be error when called with wrong id\'s format', async() => {
            let response = await axios.delete(`${process.env.API_URL}/books/1`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message)
            })
        })

        it('13. should return status 500 and the State response will be error when called with wrong id\'s format', async() => {
            let response = await axios.delete(`${process.env.API_URL}/books/${wrong_id}`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message_while_finding_an_entity('book'))
            })
        })
    })

    await after(async() => {
        await dbbooks.delete_book_by_id_category_async(category_id)
        await dbbooks.delete_book_by_id_category_async(category_id_for_update_testcase)
        await dbcategories.delete_category_async(category_id)
        await dbcategories.delete_category_async(category_id_for_update_testcase)
    })

})