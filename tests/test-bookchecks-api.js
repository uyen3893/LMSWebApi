require('dotenv').config()
const assert = require('assert')
const axios = require('axios')
const dbbookchecks = require('../dbbookchecks')
const responseEnums = require('../responseEnums')
const dbusers = require('../dbusers')
const dbbooks = require('../dbbooks')
const dbcategories = require('../dbcategories')

const date = new Date(1999, 09, 09)
const number_of_book = 123

const user_name = 'Tester'
const cmnd = '098776652'
const email = 'test@email.com'
const gender = true

const category_name = 'Test'

const isbn = 'jasd3908qrw'
const book_name = 'Testing tutorial'
const author = 'Tester'
const publisher = 'Testing publishing'

const wrong_id = '00000000-0000-0000-0000-000000000000'

describe('bookcheck api', async() => {
    let bookcheck_id = null
    let user_id = null
    let book_id = null
    let category_id = null
    let user_id_for_update = null
    before(async() => {
        const user_result = await dbusers.create_user_async(date, date, user_name, cmnd, email, gender, date)
        user_id = user_result.rows[0].new_id 
        const user_result_for_update = await dbusers.create_user_async(date, date, user_name, cmnd, email, gender, date)
        user_id_for_update = user_result_for_update.rows[0].new_id

        const category_result = await dbcategories.create_category_async(category_name)
        category_id = category_result.rows[0].new_id

        const book_result = await dbbooks.create_book_async(isbn, book_name, author, publisher, number_of_book, category_id)
        book_id = book_result.rows[0].new_id
        const book_result_for_update = await dbbooks.create_book_async(isbn, book_name, author, publisher, number_of_book, category_id)
        book_id_for_update = book_result_for_update.rows[0].new_id

        const bookcheck_result = await dbbookchecks.create_bookcheck_async(date, date, date, user_id, book_id, number_of_book)
        bookcheck_id = bookcheck_result.rows[0].new_id
        const bookcheck_result_for_update = await dbbookchecks.create_bookcheck_async(date, date, date, user_id, book_id, number_of_book)
        bookcheck_id_for_update = bookcheck_result_for_update.rows[0].new_id
        const bookcheck_result_for_delete = await dbbookchecks.create_bookcheck_async(date, date, date, user_id, book_id, number_of_book)
        bookcheck_id_for_delete = bookcheck_result_for_delete.rows[0].new_id
    })

    describe('get bookchecks', async() => {
        it('1. should return status 200 and the number of data response is equal to the number of bookchecks when called correctly', async() => {
            const response = await axios.get(`${process.env.API_URL}/bookchecks`)
            const result = await dbbookchecks.get_bookcheck_async()
            assert.strictEqual(response.data.length, result.rows.length)
            assert.strictEqual(response.status, 200)  
        })
    })

    describe('get bookcheck by id', async() => {
        it('2. should return status 200 and the response will be the same with the database when called correctly', async() => {
            const response = await axios.get(`${process.env.API_URL}/bookchecks/${bookcheck_id}`)
            const result = await dbbookchecks.get_bookcheck_by_id_async(bookcheck_id)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data[0].borroweddate, result.rows[0].borroweddate.toISOString())
            assert.strictEqual(response.data[0].expireddate, result.rows[0].expireddate.toISOString())
            assert.strictEqual(response.data[0].numberofbook, result.rows[0].numberofbook)
            assert.strictEqual(response.data[0].iduser, result.rows[0].iduser)
            assert.strictEqual(response.data[0].idbook, result.rows[0].idbook)
            assert.strictEqual(response.data[0].realdate, result.rows[0].realdate.toISOString())
        })

        it('3. should return status 500 and the State will be error when called with id\'s value', async() => {
            const response = await axios.get(`${process.env.API_URL}/bookchecks/${wrong_id}`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('bookcheck'))
            })
        })

        it('4. should return status 500 and the State will be error when called with id\'s format', async() => {
            const response = await axios.get(`${process.env.API_URL}/bookchecks/1`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.INVALID)
            })
        })
    })

    describe('create a bookcheck', async() => {
        it('5. should return status 200 and the data response is the same with the database when called correctly', async() => {
            const response = await axios.post(`${process.env.API_URL}/bookchecks`, {
                borroweddate: date.toLocaleDateString(),
                expireddate: date.toLocaleDateString(),
                numberofbook: number_of_book,
                iduser: user_id,
                idbook: book_id,
                realdate: date.toLocaleDateString()
            })
            const result = await dbbookchecks.get_bookcheck_by_id_async(response.data.Created_BookCheck_Id)
            assert.strictEqual(response.status, 201)
            assert.strictEqual(result.rows[0].borroweddate.toISOString(), date.toISOString())
            assert.strictEqual(result.rows[0].expireddate.toISOString(), date.toISOString())
            assert.strictEqual(result.rows[0].numberofbook, number_of_book)
            assert.strictEqual(result.rows[0].iduser, user_id)
            assert.strictEqual(result.rows[0].idbook, book_id)
            assert.strictEqual(result.rows[0].realdate.toISOString(), date.toISOString())

            assert.strictEqual(response.data.State, responseEnums.State.SUCCESS)
        })

        it('6. should return status 500 and the State will be error when called with no parameter', async() => {
            const response = await axios.post(`${process.env.API_URL}/bookchecks`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.ERROR)
            })
        })

        it('7. should return status 500 and the State will be error when called with wrong user id\'s value', async() => {
            const response = await axios.post(`${process.env.API_URL}/bookchecks`, {
                borroweddate: date,
                expireddate: date,
                numberofbook: number_of_book,
                iduser: wrong_id,
                idbook: book_id,
                realdate: date
    
            }).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('user'))
            })
        })

        it('8. should return status 500 and the State will be error when called with wrong book id\'s value', async() => {
            const response = await axios.post(`${process.env.API_URL}/bookchecks`, {
                borroweddate: date,
                expireddate: date,
                numberofbook: number_of_book,
                iduser: user_id,
                idbook: wrong_id,
                realdate: date
            }).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('book'))
            })
        })
    })

    describe('update bookcheck', async() => {
        it('9. should return status 200 and change the info\'s bookcheck when called correctly', async() => {
            const new_date = date
            new_date.setFullYear(date.getFullYear() + 1)
            const new_book_number = 321
            const response = await axios.put(`${process.env.API_URL}/bookchecks/${bookcheck_id_for_update}`, {
                borroweddate: new_date.toLocaleDateString(),
                expireddate: new_date.toLocaleDateString(),
                numberofbook: new_book_number,
                iduser: user_id_for_update,
                idbook: book_id_for_update,
                realdate: new_date.toLocaleDateString()
            })

            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.Updated_BookCheck_Id, bookcheck_id_for_update)
            assert.strictEqual(response.data.State, responseEnums.State.SUCCESS)
            const result = await dbbookchecks.get_bookcheck_by_id_async(bookcheck_id_for_update)
            assert.strictEqual(result.rows[0].borroweddate.toISOString(), new_date.toISOString())
            assert.strictEqual(result.rows[0].expireddate.toISOString(), new_date.toISOString())
            assert.strictEqual(result.rows[0].numberofbook, new_book_number)
            assert.strictEqual(result.rows[0].iduser, user_id_for_update)
            assert.strictEqual(result.rows[0].idbook, book_id_for_update)
            assert.strictEqual(result.rows[0].realdate.toISOString(), new_date.toISOString())
        })

        it('10. should return status 500 and the State will be error when called with no parameter', async() => {
            const response = await axios.put(`${process.env.API_URL}/bookchecks/${bookcheck_id_for_update}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('user'))
            })
        })

        it('11. should return status 500 and the State will be error when called with wrong user id\'s value', async() => {
            const response = await axios.put(`${process.env.API_URL}/bookchecks/${bookcheck_id_for_update}`, {
                borroweddate: date.toLocaleDateString(),
                expireddate: date.toLocaleDateString(),
                numberofbook: number_of_book,
                iduser: wrong_id,
                idbook: book_id,
                realdate: date.toLocaleDateString()
            }).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('user'))
            })
        })

        it('12. should return status 500 and the State will be error when called with wrong book id\'s value', async() => {
            const response = await axios.put(`${process.env.API_URL}/bookchecks/${bookcheck_id_for_update}`, {
                borroweddate: date.toLocaleDateString(),
                expireddate: date.toLocaleDateString(),
                numberofbook: number_of_book,
                iduser: user_id,
                idbook: wrong_id,
                realdate: date.toLocaleDateString()
            }).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('book'))
            })
        })

        it('13. should return status 500 and the State will be error when called with wrong bookcheck id\'s value', async() => {
            const response = await axios.put(`${process.env.API_URL}/bookchecks/${wrong_id}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('bookcheck'))
            })
        })

        it('14. should return status 500 and the State will be error when called with wrong bookcheck id\'s format', async() => {
            const response = await axios.put(`${process.env.API_URL}/bookchecks/1`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.INVALID)
            })
        })
    })

    describe('delete a bookcheck', async() => {
        it('15. should return status 200 and delete bookcheck in the database when called correctly', async() => {
            const response = await axios.delete(`${process.env.API_URL}/bookchecks/${bookcheck_id_for_delete}`)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, responseEnums.State.SUCCESS)
            assert.strictEqual(response.data.Deleted_BookCheck_Id, bookcheck_id_for_delete)
            const result = await dbbookchecks.get_bookcheck_by_id_async(bookcheck_id_for_delete)
            assert.strictEqual(result.rows.length, 0)
        })

        it('16. should return status 500 and the State will be error when called with wrong id\'s format', async() => {
            const response = await axios.delete(`${process.env.API_URL}/bookchecks/1`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.INVALID)
            })
        })

        it('17. should return status 500 and the State will be error when called with wrong id\'s value', async() => {
            const response = await axios.delete(`${process.env.API_URL}/bookchecks/${wrong_id}`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('bookcheck'))
            })
        })
    })

    after(async() => {
        await dbbookchecks.delete_bookcheck_by_user_id_async(user_id)
        await dbbookchecks.delete_bookcheck_by_user_id_async(user_id_for_update)
        await dbusers.delete_user_async(user_id)
        await dbusers.delete_user_async(user_id_for_update)
        await dbbooks.delete_book_by_id_category_async(category_id)
        await dbcategories.delete_category_async(category_id)
    })
})