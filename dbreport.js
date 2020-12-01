const sql = require('./sql')

module.exports = {
    get_number_of_users: (callback) => {
        sql.query('SELECT * FROM "ThongKeSoLuongDocGia"', (error, result) => {
            callback(error, result)
        })
    },
    async get_number_of_users_async () {
        return await sql.query_async('SELECT * FROM "ThongKeSoLuongDocGia"')
    },
    get_number_of_users_by_gender: (callback) => {
        sql.query('SELECT * FROM "ThongKeSoLuongDocGiaTheoGioiTinh"', (error, result) => {
            callback(error, result)
        })
    },
    async get_number_of_users_by_gender_async() {
        return await sql.query_async('SELECT * FROM "ThongKeSoLuongDocGiaTheoGioiTinh"')
    },
    get_number_of_books: (callback) => {
        sql.query('SELECT * FROM "ThongKeSoLuongSach"', (error, result) => {
            callback(error, result)
        })
    },
    async get_number_of_books_async() {
        return await sql.query_async('SELECT * FROM "ThongKeSoLuongSach"')
    },
    get_number_of_borrowed_books: (callback) => {
        sql.query('SELECT * FROM "ThongKeSoLuongSachDuocMuon"', (error, result) => {
            callback(error, result)
        })
    },
    async get_number_of_borrowed_books_async() {
        return await sql.query_async('SELECT * FROM "ThongKeSoLuongSachDuocMuon"')
    },
    get_number_of_books_by_categories: (callback) => {
        sql.query('SELECT * FROM "ThongKeSoLuongSachTheoTheLoai"', (error, result) => {
            callback(error, result)
        })
    },
    async get_number_of_books_by_categories_async() {
        return await sql.query_async('SELECT * FROM "ThongKeSoLuongSachTheoTheLoai"')
    }
}