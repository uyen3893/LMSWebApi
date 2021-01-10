require('dotenv').config()
const assert = require('assert')
const axios = require('axios')
const dbcategories = require('../dbcategories')
const responseEnums = require('../responseEnums')

const name = 'Test'
const wrong_id = '00000000-0000-0000-0000-000000000000'

describe('test categories', async() => {
    let category_id = null
    let category_id_for_update = null
    let category_id_for_delete = null
    before(async() => {
        const result = await dbcategories.create_category_async(name)
        category_id = result.rows[0].new_id
        const result_for_update = await dbcategories.create_category_async(name)
        category_id_for_update = result_for_update.rows[0].new_id
        const result_for_delete = await dbcategories.create_category_async(name)
        category_id_for_delete = result_for_delete.rows[0].new_id
    })

    describe('get categories', async() => {
        it('1. should return status 200 and the number of the data response is equal with the number of the database when called', async() => {
            const response = await axios.get(`${process.env.API_URL}/categories`)
            const result = await dbcategories.count_number_of_categories_async()
            const number_of_categories = result.rows[0].count
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.length, parseInt(number_of_categories))
       })
    })

    describe('get category by id', async() => {
        it('2. should return status 200 and the data response is correct when called', async() => {
            const response = await axios.get(`${process.env.API_URL}/categories/${category_id}`)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data[0].name, name)
            assert.strictEqual(response.data[0].id, category_id)
        })

        it('3. should return status 500 and the State will be error when called with wrong id\'s format', async() => {
            const response = await axios.get(`${process.env.API_URL}/categories/1`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.INVALID)
            })
            
        })

        it('4. should return status 500 and the State will be error when called with wrong id\'s value', async() => {
            const response = await axios.get(`${process.env.API_URL}/categories/${wrong_id}`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('category'))
            })
        })
    })

    describe('create category', async() => {
        it('5. should return status 201 and the data in database is the same with the data response when called successfully', async() => {
            const updated_name = 'Testing'
            const response = await axios.post(`${process.env.API_URL}/categories/`, {
                name: updated_name
            })
            assert.strictEqual(response.data.State, responseEnums.State.SUCCESS)
            assert.strictEqual(response.status, 201)
            const db_result = await dbcategories.get_category_by_id_async(response.data.Created_Category_Id)
            assert.strictEqual(db_result.rows[0].name, updated_name)
        })

        it('6. should return status 500 and the State will be error when called with no parameter', async() => {
            const response = await axios.post(`${process.env.API_URL}/categories/`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.ERROR)
            })
        })
    })

    describe('update category', async() => {
        it('7. should return status 200 and the data in database is the same with the data response when called successfully', async() => {
            const updated_name = 'Testing'
            const response = await axios.put(`${process.env.API_URL}/categories/${category_id_for_update}`, {
                name: updated_name
            })
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, responseEnums.State.SUCCESS)
            assert.strictEqual(response.data.Updated_Category_Id, category_id_for_update)
            const db_result = await dbcategories.get_category_by_id_async(response.data.Updated_Category_Id)
            assert.strictEqual(db_result.rows[0].name, updated_name)
        })

        it('8. should return status 500 and the State will be error when called with no parameter', async() => {
            const response = await axios.put(`${process.env.API_URL}/categories/${category_id_for_update}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.ERROR)
            })
        })

        it('9. should return status 500 and the State will be error when called with wrong id\'s value', async() => {
            const response = await axios.put(`${process.env.API_URL}/categories/${wrong_id}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('category'))
            })
        })

        it('10. should return status 500 and the State will be error when called with wrong id\'s format', async() => {
            const response = await axios.put(`${process.env.API_URL}/categories/1`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.INVALID)
            })
        })
    })

    describe('delete category', async() => {
        it('11. should return status 200 and delete category in database when called correctly', async() => {
            const response = await axios.delete(`${process.env.API_URL}/categories/${category_id_for_delete}`)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, responseEnums.State.SUCCESS)
            assert.strictEqual(response.data.Deleted_Category_Id, category_id_for_delete)
            const db_result = await dbcategories.get_category_by_id_async(category_id_for_delete)
            assert.strictEqual(db_result.rows.length, 0)
        })

        it('12. should return status 500 and the State will be error when called with wrong id\'s value', async() => {
            const response = await axios.delete(`${process.env.API_URL}/categories/${wrong_id}`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.FINDING_ERROR('category'))
            })
        })

        it('13. should return status 500 and the State will be error when called with wrong id\'s format', async() => {
            const response = await axios.delete(`${process.env.API_URL}/categories/1`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, responseEnums.State.ERROR)
                assert.strictEqual(error.response.data.Error_Message, responseEnums.Error_Message.INVALID)
            })
        })
    })

    after(async() => {
        await dbcategories.delete_category_async(category_id)
        await dbcategories.delete_category_async(category_id_for_update)
    })
})
