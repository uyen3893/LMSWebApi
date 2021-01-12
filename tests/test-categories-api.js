require('dotenv').config
const dbcategories = require('../dbcategories')
const assert = require('assert')
const axios = require('axios')

const State = {
    ERROR: 'Error',
    SUCCESS: 'Success'
}

const ErrorResponseMessage = "Error occurs when execute query on database"

const name = 'Test'

describe('test categories', async() => {
    let category_id = null
    before(async() => {
        const result = await dbcategories.create_category_async(name)
        category_id = result.rows[0].new_id
    })

    describe('get categories', async() => {
        describe('1. should return status 200 and the number of the data response is equal with the number of the database when called', async() => {
            const response = await axios.get(`${process.env.API_URL}/categories`)
            const result = await dbcategories.count_number_of_categories_async()
            const number_of_categories = result.rows[0].count
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.length, parseInt(number_of_categories))
       })
    })

    await after(async() => {
        await dbcategories.delete_category_async()
    })
})
