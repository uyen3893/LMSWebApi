const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'LMS',
  password: '123456789',
  port: 5432,
})

//Get the list of users
const getUsers = (request, response) => {
    pool.query('SELECT * FROM public.users', (error, result) => {
        if(error) {
            throw error;
        }
        response.status(200).json(result.rows);
    })
}

//Get the name of user by ID
const getUserByID = (request, response) => {
    const id = request.params.id;
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, result) => {
        if(error) {
            throw error;
        }
        response.status(200).json(result.rows);
    })
}

//Create a new user
const createUser = (request, response) => {
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    pool.query('SELECT public."InsertUser"($1, $2, $3, $4, $5, $6, $7) as new_id', [birthdate, signupdate, name, cmnd, email, gender, expirydate],
        //'INSERT INTO users(name, gender, cmnd, email, birthdate, signupdate, expirydate) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
    (error, result) => {
        if(error) {
            throw error;
        }
        response.status(201).json(result.rows);
    })

}

//Update a user
const updateUser = (request, response) => {
    const id = request.params.id;
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    pool.query('CALL public."UpdateUsers"($1, $2, $3, $4, $5, $6, $7, $8)',
    [name, cmnd, email, gender, birthdate, signupdate, expirydate, id], (error, result) => {
        if(error) {
            throw error;
        }
        response.status(200).json(result);
    })
}

//Delete a user
const deleteUser = (request, response) => {
    const id = request.params.id;
    pool.query('CALL public."DeleteUser" ($1)', [id], (error, result) => {
        if(error) {
            throw error;
        }
        response.status(200).json(result.rows);
    })
}

//Get list of books
const getBooks = (req, res) => {
    pool.query('SELECT b.id, b.isbn, b.name, b.author, b.publisher, b.quantity, c.name AS name_category FROM books b JOIN categories c ON b.id_category = c.id', 
    (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//Get a book by ID
const getBookByID = (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM books WHERE id = $1', [id], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//Create a book
const createBook = (req, res) => {
    const {name, isbn, author, publisher, quantity, id_category} = req.body;
    pool.query('SELECT public."InsertBook" ($1, $2, $3, $4, $5, $6) AS new_id' , [isbn, name, author, publisher, quantity, id_category],
    (err, result) => {
        if(err) {
            throw err;
        }
        res.status(201).json(result.rows);
    })
}

//Update a book
const updateBook = (req, res) => {
    const id = req.params.id;
    const {name, isbn, author, publisher, quantity, id_category} = req.body;
    pool.query('CALL public."UpdateBooks" ($1, $2, $3, $4, $5, $6, $7)',
    [isbn, name, author, publisher, quantity, id_category, id], (err, result) => {
        if(err){
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//Delete a book
const deleteBook = (req, res) => {
    const id = req.params.id;
    pool.query('CALL public."DeleteBook" ($1)', [id], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//Get the list of category
const getCategory = (req, res) => {
    pool.query('SELECT * FROM categories', (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//Get a category by ID
const getCategoryByID = (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM categories WHERE id = $1', [id], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows)
    })
}
//Create a new category
const createCategory = (req, res) => {
    const {name} = req.body;
    pool.query('SELECT public."InsertCategory" ($1) as new_id', [name], (err, result) => {
        if(err){
            throw err;
        }
        res.status(201).json(result.rows);
    })
}


//Update category
const updateCategory = (req, res) => {
    const id = req.params.id;
    const {name} = req.body;
    pool.query('CALL public."UpdateCategories" ($1, $2)', [name, id], (err, result) => {
        if(err){
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//Delete category
const deleteCategory = (req, res) => {
    const id = req.params.id;
    pool.query('CALL public."DeleteCategory" ($1)', [id], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}
//Get the list of bookchecks
const getBookChecks = (req, res) => {
    pool.query('SELECT * FROM bookchecks', (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}
//Get the list of bookcheck by ID
const getBookChecksByID = (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM bookchecks WHERE id = $1', [id], (err, result) => {
        if(err) {
            throw err
        }
        res.status(200).json(result.rows);
    })
}
// Create a bookcheck
const createBookCheck = (req, res) => {
    const {borroweddate, expireddate, realdate, iduser, idbook, numberofbook} = req.body;
    pool.query('SELECT public."InsertBookCheck" ($1, $2, $3, $4, $5, $6)', 
    [borroweddate, expireddate, realdate, iduser, idbook, numberofbook], (err, result) => {
        if(err) {
            throw err
        }
        res.status(201).json(result.rows);
    })
}

//Update a bookcheck
const updateBookCheck = (req, res) => {
    const id = req.params.id;
    const {borroweddate, expireddate, numberofbook, iduser, idbook, realdate} = req.body;
    pool.query('CALL public."UpdateBookChecks" ($1, $2, $3, $4, $5, $6, $7)', 
    [borroweddate, expireddate, numberofbook, iduser, idbook, realdate, id], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//Delete a bookcheck
const deleteBookCheck = (req, res) => {
    const id = req.params.id;
    pool.query('CALL public."DeleteBookCheck" ($1)', [id], (err, result) =>{
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows)
    })

}
//The number of users' report
const getNumberOfUsersReport = (req, res) => {
    pool.query('SELECT * FROM "ThongKeSoLuongDocGia"', (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//The number of users' gender report
const getNumberOfUsersGender = (req, res) => {
    pool.query('SELECT * FROM "ThongKeSoLuongDocGiaTheoGioiTinh"', (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//The number of books' report
const getNumberOfBooks = (req, res) => {
    pool.query('SELECT * FROM "ThongKeSoLuongSach"', (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//The number of borrowed books' report
const getNumberOfBorrowedBooks = (req, res) => {
    pool.query('SELECT * FROM "ThongKeSoLuongSachDuocMuon"', (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

//The number of books by categories' report
const getNumberOfBooksByCategories = (req, res) => {
    pool.query('SELECT * FROM "ThongKeSoLuongSachTheoTheLoai"', (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows);
    })
}

module.exports = {
    getUsers,
    getUserByID,
    createUser,
    updateUser,
    deleteUser,
    getBooks,
    getBookByID,
    createBook,
    updateBook,
    deleteBook,
    getCategory,
    getCategoryByID,
    createCategory,
    updateCategory,
    deleteCategory,
    getNumberOfUsersReport, 
    getNumberOfUsersGender,
    getNumberOfBooks,
    getNumberOfBorrowedBooks,
    getNumberOfBooksByCategories,
    getBookChecks,
    getBookChecksByID,
    createBookCheck,
    updateBookCheck,
    deleteBookCheck
  }