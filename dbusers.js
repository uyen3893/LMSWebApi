const sql = require('./sql')

module.exports = {
    get_users: (callback) => {
        sql.query('SELECT * FROM users',null, (error, result) => {
            callback(error, result)
        })    
    },
    async get_users_async() {
        return await sql.query_async('SELECT * FROM users')
    },
    get_user_by_id: (id, callback) => {
        sql.query('SELECT * FROM users WHERE id = $1', [id], (error, result) => {
            callback(error, result)
        })
    },
    async get_user_by_id_async(id) {
        return await sql.query_async('SELECT * FROM users WHERE id = $1', [id])
    },
    create_user: ([birthdate, signupdate, name, cmnd, email, gender, expirydate], callback) => {
        sql.query('SELECT public."InsertUser"($1, $2, $3, $4, $5, $6, $7) as new_id', [birthdate, signupdate, name, cmnd, email, gender, expirydate],(error, result) => {
            callback(error, result)
        })
    },
    async create_user_async(birthdate, signupdate, name, cmnd, email, gender, expirydate) {
        return await sql.query_async('SELECT public."InsertUser"($1, $2, $3, $4, $5, $6, $7) as new_id', [birthdate, signupdate, name, cmnd, email, gender, expirydate])
    },
    update_user: ([name, cmnd, email, gender, birthdate, signupdate, expirydate, id], callback) => {
        sql.query('CALL public."UpdateUsers"($1, $2, $3, $4, $5, $6, $7, $8)',
        [name, cmnd, email, gender, birthdate, signupdate, expirydate, id], (error, result) => {
            callback(error, result)
        })
    },
    async update_user_async (name, cmnd, email, gender, birthdate, signupdate, expirydate, id){
        return await sql.query_async('CALL public."UpdateUsers"($1, $2, $3, $4, $5, $6, $7, $8)',
        [name, cmnd, email, gender, birthdate, signupdate, expirydate, id])
    },
    delete_user: (id, callback) => {
        sql.query('CALL public."DeleteUser" ($1)', [id], (error, result) => {
            callback(error, result)
        })
    },
    async delete_user_async(id) {
        return await sql.query_async('CALL public."DeleteUser" ($1)', [id])
    },
    count_number_of_users: (callback) => {
        sql.query('SELECT COUNT(1) FROM users', (error, result) => {
            callback(error, result)
        })
    }
}