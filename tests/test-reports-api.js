require('dotenv').config()
const dbreport = require('../dbreport')
const assert = require('assert')
const axios = require('axios')

describe('report api', async() => {
    describe('get number of users', async() => {
        it('1. should return status 200 and the data response will be the same with the database when called correctly', async() => {
            const response = await axios.get(`${process.env.API_URL}/reports/numberofusers`)
            assert.strictEqual(response.status, 200)
            const result = await dbreport.get_number_of_users_async()
            assert.strictEqual(response.data[0].total, result.rows[0].total)
        })
    })

    describe('get number of users by gender', async() => {
        it('2. should return status 200 and the data response will be the same with the database when called correctly', async() => {
            const response = await axios.get(`${process.env.API_URL}/reports/numberofusersbygender`)
            assert.strictEqual(response.status, 200)
            const result = await dbreport.get_number_of_users_by_gender_async()
            for (var i = 0; i > response.data.length; i++) {
                assert.strictEqual(response.data[i].total, result.rows[i].total)
            }
        })
    })

    describe('get number of books', async() => {
        it('3. should return status 200 and the data response will be the same with the database when called correctly', async() => {
            const response = await axios.get(`${process.env.API_URL}/reports/numberofbooks`)
            assert.strictEqual(response.status, 200)
            const result = await dbreport.get_number_of_books_async()
            assert.strictEqual(response.data[0].total, result.rows[0].total)
        })
    })

    describe('get number of borrowed books', async() => {
        it('4. should return status 200 and the data response will be the same with the database when called correctly', async() => {
            const response = await axios.get(`${process.env.API_URL}/reports/numberofborrowedbooks`)
            assert.strictEqual(response.status, 200)
            const result = await dbreport.get_number_of_borrowed_books_async()
            for (var i = 0; i > response.data.length; i++) {
                assert.strictEqual(response.data[i].total, result.rows[i].total)
            }
        })
    })

    describe('get number of books by category', async() => {
        it('5. should return status 200 and the data response will be the same with the database when called correctly', async() => {
            const response = await axios.get(`${process.env.API_URL}/reports/numberofbooksbycategories`)
            assert.strictEqual(response.status, 200)
            const result = await dbreport.get_number_of_books_by_categories_async()
            for (var i = 0; i > response.data.length; i++) {
                assert.strictEqual(response.data[i].total, result.rows[i].total)
            }
        })
    })
})