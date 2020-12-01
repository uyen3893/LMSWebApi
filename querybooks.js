const Pool = require('pg').Pool
const dbbooks = require('./dbbooks')
const sql = require('./sql')

const State = {
    SUCCESS: "Success",
    ERROR: "Error"
}

//Get list of books
const getBooks = (request, response) => {
    dbbooks.get_books((error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows);
    })
}

const getBooksAsync = async (request, response) => {
    try {
        const result = await dbbooks.get_books_async()
        response.status(200).json(result.rows)
    } catch (error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
    
}

//Get a book by ID
const getBookByID = (request, response) => {
    const id = request.params.id
    dbbooks.get_book_by_id(id, (error, result) => {
        if(error) {
            console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows);
    })
}
const getBookByIDAsync = async (request, response) => {
    const id = request.params.id
    try {
        const result = await dbbooks.get_book_by_id_async(id)
        response.status(200).json(result.rows)
    } catch(error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}

//Create a book
const createBook = (request, response) => {
    const {name, isbn, author, publisher, quantity, id_category} = request.body;
    dbbooks.create_book([isbn, name, author, publisher, quantity, id_category], (error, result) => {
        if(error) {
            console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
            return;
        }
        let res = {
            State: State.SUCCESS,
            createdBookId: result.rows[0].new_id
        }
        response.status(201).json(res);
    })
}

const createBookAsync = async (request, response) => {
    const {name, isbn, author, publisher, quantity, id_category} = request.body;
    try {
        const result = await dbbooks.create_book_async(isbn, name, author, publisher, quantity, id_category)
        let res = {
            State: State.SUCCESS,
            createdBookId: result.rows[0].new_id
        }
        response.status(201).json(res);
    } catch (error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}
//Update a book
const updateBook = (request, response) => {
    const id = request.params.id;
    const {name, isbn, author, publisher, quantity, id_category} = request.body;
    dbbooks.update_book([isbn, name, author, publisher, quantity, id_category, id], (error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
            return;
        }
        let res = {
            State: State.SUCCESS,
            UpdatedBookId: id
        }
        response.status(200).json(res);
    })
}
const updateBookAsync = async (request, response) =>{
    const id = request.params.id;
    const {name, isbn, author, publisher, quantity, id_category} = request.body;
    try {
        const result = await dbbooks.update_book_async(isbn, name, author, publisher, quantity, id_category, id)
        let res = {
            State: State.SUCCESS,
            UpdatedBookId: id
        }
        response.status(200).json(res);
    } catch (error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}

//Delete a book
const deleteBook = (request, response) => {
    const id = request.params.id;
    dbbooks.delete_book(id, (error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
            return;
        }
        let res = {
            State: State.SUCCESS,
            DeletedBookId: id
        }
        response.status(200).json(res);
    })
}

const deleteBookAsync = async (request, response) => {
    const id = request.params.id
    try {
        const result = await dbbooks.delete_book_async(id)
        let res = {
            State: State.SUCCESS,
            DeletedBookId: id
        }
        response.status(200).json(res);
    } catch (error) {
        console.error(error);
        let err = {
            State: State.ERROR,
            ErrorMessage: "Error occurs when execute query on database"
        }
        response.status(500).json(err);
    }
}

module.exports = {
    getBooks,
    getBooksAsync,
    getBookByID,
    getBookByIDAsync,
    createBook,
    createBookAsync,
    updateBook,
    updateBookAsync,
    deleteBook,
    deleteBookAsync
}
