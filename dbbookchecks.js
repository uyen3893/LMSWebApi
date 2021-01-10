const sql = require('./sql')

module.exports = {
    get_bookchecks: (callback) => {
        sql.query('SELECT * FROM bookchecks', (error, result) => {
            callback(error, result)
        })
    },
    async get_bookcheck_async() {
        return await sql.query_async('SELECT * FROM bookchecks')
    },
    get_bookcheck_by_id: (id, callback) => {
        sql.query('SELECT * FROM bookchecks WHERE id = $1', [id], (error, result) => {
            callback(error, result)
        })
    },
    async get_bookcheck_by_id_async(id) {
        return await sql.query_async('SELECT * FROM bookchecks WHERE id = $1', [id])
    },
    create_bookcheck: ([borroweddate, expireddate, realdate, iduser, idbook, numberofbook], callback) => {
        sql.query('SELECT public."InsertBookCheck" ($1, $2, $3, $4, $5, $6) as new_id', 
        [borroweddate, expireddate, realdate, iduser, idbook, numberofbook], (error, result) => {
            callback(error, result)
        })
    },
    async create_bookcheck_async(borroweddate, expireddate, realdate, iduser, idbook, numberofbook) {
        return await sql.query_async('SELECT public."InsertBookCheck" ($1, $2, $3, $4, $5, $6) as new_id', 
        [borroweddate, expireddate, realdate, iduser, idbook, numberofbook])
    },
    update_bookcheck: ([borroweddate, expireddate, numberofbook, iduser, idbook, realdate, id], callback) => {
        sql.query('CALL public."UpdateBookChecks" ($1, $2, $3, $4, $5, $6, $7)', 
        [borroweddate, expireddate, numberofbook, iduser, idbook, realdate, id], (error, result) => {
            callback(error, result)
        })
    }, 
    async update_bookcheck_async (borroweddate, expireddate, numberofbook, iduser, idbook, realdate, id) {
        return await sql.query_async('CALL public."UpdateBookChecks" ($1, $2, $3, $4, $5, $6, $7)', 
        [borroweddate, expireddate, numberofbook, iduser, idbook, realdate, id])
    },
    delete_bookcheck: (id, callback) => {
        sql.query('CALL public."DeleteBookCheck" ($1)', [id], (error, result) => {
            callback(error, result)
        })
    },
    async delete_bookcheck_async (id) {
        return await sql.query_async('CALL public."DeleteBookCheck" ($1)', [id])
    },
    async delete_bookcheck_by_user_id_async(id) {
        return await sql.query_async('CALL public."DeleteBookCheckByUserId" ($1)', [id])
    }
}