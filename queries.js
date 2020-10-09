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
    pool.query('SELECT * FROM public.users', (error, results) => {
        if(error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
}

//Get the name of user by ID
const getUserByID = (request, response) => {
    const id = request.params.id;
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if(error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
}

//Create a new user
const createUser = (request, response) => {
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    pool.query('INSERT INTO users(name, gender, cmnd, email, birthdate, signupdate, expirydate) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
    [name, gender, cmnd, email, birthdate, signupdate, expirydate], (error, result) => {
        if(error) {
            throw error;
        }
        response.status(201).send(`User added with ID: ${JSON.stringify(result)}`);
    })

}

//Update a user
const updateUser = (request, response) => {
    const id = request.params.id;
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    pool.query('UPDATE users SET name = $1, cmnd = $2, email = $3, gender = $4, birthdate = $5, signupdate = $6, expirydate = $7 where id = $8',
    [name, cmnd, email, gender, birthdate, signupdate, expirydate, id], (error, result) => {
        if(error) {
            throw error;
        }
        response.status(200).send(`User modified with ID: ${id}`);
    })
}

//Delete a user
const deleteUser = (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if(error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    })
}

//Get list of books
const getBooks = (req, res) => {
    pool.query('SELECT b.id, b.isbn, b.name, b.author, b.publisher, b.quantity, c.name AS name_category FROM books b JOIN categories c ON b.id_category = c.id', 
    (err, results) => {
        if(err) {
            throw err;
        }
        res.status(200).json(results.rows);
    })
}

//Get a book by ID
const getBookByID = (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM books WHERE id = $1', [id], (err, results) => {
        if(err) {
            throw err;
        }
        res.status(200).json(results);
    })
}

//Create a book
const createBook = (req, res) => {
    const {name, isbn, author, publisher, quantity, id_category} = req.body;
    pool.query('INSERT INTO books (name, isbn, author, publisher, quantity, id_category) VALUES ($1, $2, $3, $4, $5, $6)', 
    [name, isbn, author, publisher, quantity, id_category], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(201).send(`Add new book with ID: ${result.id}`);
    })
}

//Update a book
const updateBook = (req, res) => {
    const id = req.params.id;
    const {name, isbn, author, publisher, quantity, id_category} = req.body;
    pool.query('UPDATE books SET name = $1, isbn = $2, author = $3, publisher = $4, quantity = $5, id_category = $6 WHERE id = $7',
    [name, isbn, author, publisher, quantity, id_category, id], (err, results) => {
        if(err){
            throw err;
        }
        res.status(200).send(`Update a book with id: ${id}`);
    })
}

//Delete a book
const deleteBook = (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM books WHERE id = $1', [id], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).send(`Delete a book with ID: ${id}`);
    })
}

//Get the list of category
const getCate = (req, res) => {
    pool.query('SELECT * FROM categories', (err, results) => {
        if(err) {
            throw err;
        }
        res.status(200).json(results.rows);
    })
}

//Get a category by ID
const getCateByID = (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM categories WHERE id = $1', [id], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).json(result.rows)
    })
}
//Create a new category
const createCate = (req, res) => {
    const {name} = req.body;
    pool.query('INSERT INTO categories (name) VALUES ($1)', [name], (err, result) => {
        if(err){
            throw err;
        }
        res.status(201).send(`Create new category successfully`);
    })
}

//Update category
const updateCate = (req, res) => {
    const id = req.params.id;
    const {name} = req.body;
    pool.query('UPDATE categories SET name = $1 WHERE id = $2', [name, id], (err, result) => {
        if(err){
            throw err;
        }
        res.status(200).send(`Update category with the ID: ${id}`);
    })
}

//Delete category
const deleteCate = (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM categories WHERE id = $1', [id], (err, result) => {
        if(err) {
            throw err;
        }
        res.status(200).send(`Delete category with the ID: ${id}`)
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
    getCate,
    getCateByID,
    createCate,
    updateCate,
    deleteCate
  }