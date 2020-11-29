const sql = require('./sql')

module.exports = {
    get_books: (callback) => {
        sql.query('SELECT b.id, b.isbn, b.name, b.author, b.publisher, b.quantity, c.name AS name_category FROM books b JOIN categories c ON b.id_category = c.id',
        (error, result) => {
            callback(error, result)
        })
    },
    async get_books_async() {
        return await sql.query_async('SELECT b.id, b.isbn, b.name, b.author, b.publisher, b.quantity, c.name AS name_category FROM books b JOIN categories c ON b.id_category = c.id')
    },
    get_book_by_id: (id, callback) => {
        sql.query('SELECT * FROM books WHERE id = $1', [id], (error, result) => {
            callback(error, result)
        })
    },
    async get_book_by_id_async(id) {
        return await sql.query_async('SELECT * FROM books WHERE id = $1', [id])
    },
    create_book: ([isbn, name, author, publisher, quantity, id_category], callback) => {
        sql.query('SELECT public."InsertBook" ($1, $2, $3, $4, $5, $6) AS new_id' , 
        [isbn, name, author, publisher, quantity, id_category],
        (error, result) => {
            callback(error, result)
        })
    },
    async create_book_async(isbn, name, author, publisher, quantity, id_category) {
        return await sql.query_async('SELECT public."InsertBook" ($1, $2, $3, $4, $5, $6) AS new_id' , 
        [isbn, name, author, publisher, quantity, id_category])
    },
    update_book: ([isbn, name, author, publisher, quantity, id_category, id], callback) => {
        sql.query('CALL public."UpdateBooks" ($1, $2, $3, $4, $5, $6, $7)', 
        [isbn, name, author, publisher, quantity, id_category, id], (error, result) => {
            callback(error, result)
        })
    },
    async update_book_async(isbn, name, author, publisher, quantity, id_category, id) {
        return await sql.query_async('CALL public."UpdateBooks" ($1, $2, $3, $4, $5, $6, $7)', 
        [isbn, name, author, publisher, quantity, id_category, id])
    },
    delete_book: (id, callback) => {
        sql.query('CALL public."DeleteBook" ($1)', [id], (error, result) => {
            callback(error, result)
        })
    },
    async delete_book_async(id) {
        return await sql.query_async('CALL public."DeleteBook" ($1)', [id])
    }
}