const sql = require('./sql')

module.exports = {
    get_categories: (callback) => {
        sql.query('SELECT * FROM categories', (error, result) => {
            callback(error, result)
        })
    },
    async get_categories_async() {
        return await sql.query_async('SELECT * FROM categories')
    },
    get_category_by_id: (id, callback) => {
        sql.query('SELECT * FROM categories WHERE id = $1', [id], (error, result) => {
            callback(error, result)
        })
    },
    async get_category_by_id_async(id) {
        return await sql.query_async('SELECT * FROM categories WHERE id = $1', [id])
    },
    create_category: (name, callback) => {
        sql.query('SELECT public."InsertCategory" ($1) as new_id', [name], (error, result) => {
            callback(error, result)
        })
    },
    async create_category_async (name) {
        return await sql.query_async('SELECT public."InsertCategory" ($1) as new_id', [name])
    },
    update_category: (name, id, callback) => {
        sql.query('CALL public."UpdateCategories" ($1, $2)', [name, id], (error, result) => {
            callback(error, result)
        })
    },
    async update_category_async (name, id) {
        return await sql.query_async('CALL public."UpdateCategories" ($1, $2)', [name, id])
    },
    delete_category: (id, callback) => {
        sql.query('CALL public."DeleteCategory" ($1)', [id], (error, result) => {
            callback(error, result)
        })
    },
    async delete_category_async (id) {
        return await sql.query_async('CALL public."DeleteCategory" ($1)', [id])
    },
    async count_number_of_categories_async () {
        return await sql.query_async('SELECT COUNT(1) FROM categories')
    },
    async get_category_by_name(name) {
        return await sql.query_async('SELECT id FROM categories WHERE name = $1', [name])
    }
}