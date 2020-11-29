const Pool = require('pg').Pool
const dbusers = require('./dbusers')
const dbbooks = require('./dbbooks')
const sql = require('./sql')
const dbcategories = require('./dbcategories')
const dbcheckbooks = require('./dbcheckbooks')
const dbreport = require('./dbreport')
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

const State = {
    SUCCESS: "Success",
    ERROR: "Error"
}
//Get the list of users
const getUsers = (request, response) => {
    dbusers.get_users((error, result) => {
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
const getUsersAsync = async (request, response) => {
    try {
        const result = await dbusers.get_users_async()
        response.status(200).json(result.rows);
    } catch(error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
    
}

//Get the name of user by ID
const getUserByID = (request, response) => {
    const id = request.params.id;
    dbusers.get_user_by_id(id, (error, result) => {
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
const getUserByIDAsync = async (request, response) => {
    const id = request.params.id;
    try {
        const result = await dbusers.get_user_by_id_async(id)
        response.status(200).json(result.rows);
    } catch(error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
    
}

//Create a new user
const createUser = (request, response) => {
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    dbusers.create_user([birthdate, signupdate, name, cmnd, email, gender, expirydate], (error, result) => {
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
            InsertedUserId: result.rows[0].new_id
        }
        response.status(201).json(res);
    })
}

const createUserAsync = async (request, response) => {
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    try {
        const result = await dbusers.create_user_async(birthdate, signupdate, name, cmnd, email, gender, expirydate)
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

//Update a user

const updateUser = (request, response) => {
    const id = request.params.id;
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    dbusers.update_user([name, cmnd, email, gender, birthdate, signupdate, expirydate, id], (error, result) => {
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
            UpdatedUserId: id
        }
        response.status(200).json(res);
    })
}
const updateUserAsync = async (request, response) => {
    try {
        const id = request.params.id;
        const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
        const result = await dbusers.update_user_async(name, cmnd, email, gender, birthdate, signupdate, expirydate, id)
        let res = {
            State: State.SUCCESS,
            UpdatedUserId: id
        }
        response.status(200).json(res);
    } catch (error) {
        console.log(error)
        let err = {
            State: State.ERROR,
            ErrorMessage: "Error occurs when execute query on database"
        }
        response.status(500).json(err)
    }
}

//Delete a user
const deleteUser = (request, response) => {
    const id = request.params.id;
    dbusers.delete_user(id, (error, result) => {
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
            DeletedUserId: id
        }
        response.status(200).json(res);
    })
}

const deleteUserAsync = async (request, response) => {
    const id = request.params.id;
    try {
        const result = await dbusers.delete_user_async(id)
        let res = {
            State: State.SUCCESS,
            DeletedUserId: id
        }
        response.status(200).json(res);
    } catch(error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
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
        response.status(201).json(res);
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
        response.status(201).json(res);
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

//Get the list of category
const getCategories = (request, response) => {
    dbcategories.get_categories((error, result) => {
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
const getCategoriesAsync = async (request, response) => {
    try {
        const result = await dbcategories.get_categories_async()
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}

//Get a category by ID
const getCategoryByID = (request, response) => {
    const id = request.params.id;
    dbcategories.get_category_by_id(id, (error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows)
    })
}

const getCategoryByIDAsync = async (request, response) => {
    try {
        const id = request.params.id;
        const result = await dbcategories.get_category_by_id_async(id)
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
//Create a new category
const createCategory = (request, response) => {
    const {name} = request.body
    dbcategories.create_category(name, (error, result) => {
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
            CreatedCategoryId: result.rows[0].new_id
        }
        response.status(201).json(res);
    })
}
const createCategoryAsync = async (request, response) => {
    try {
        const {name} = request.body
        const result = await dbcategories.create_category_async(name)
        let res = {
            State: State.SUCCESS,
            CreatedCategoryId: result.rows[0].new_id
        }
        response.status(201).json(res);
    } catch(error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}

//Update category
const updateCategory = (request, response) => {
    const id = request.params.id;
    const {name} = request.body;
    dbcategories.update_category([name, id], (error, result) => {
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
            UpdatedCategoryId: id
        }
        response.status(201).json(res);
    })
}
const updateCategoryAsync = async (request, response) => {
    try {
        const id = request.params.id;
        const {name} = request.body;
        const result = await dbcategories.update_category_async(name, id)
        let res = {
            State: State.SUCCESS,
            UpdatedCategoryId: id
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

//Delete category
const deleteCategory = (request, response) => {
    const id = request.params.id
    dbcategories.delete_category(id, (error, result) => {
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
            DeletedCategoryId: id
        }
        response.status(201).json(res);
    })
}

const deleteCategoryAsync = async (request, response) => {
    try {
        const id = request.params.id
        const result = await dbcategories.delete_category_async(id)
        let res = {
            State: State.SUCCESS,
            DeletedCategoryId: id
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
//Get the list of bookchecks
const getBookChecks = (request, response) => {
    dbcheckbooks.get_bookchecks((error, result) => {
        if (error) {
            console.error(error);
            let err= {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows);
    })
}

const getBookChecksAsync = async (request, response) => {
    try {
        const result = await dbcheckbooks.get_bookcheck_async()
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}
//Get the list of bookcheck by ID
const getBookChecksByID = (request, response) => {
    const id = request.params.id;
    dbcheckbooks.get_bookcheck_by_id(id, (error, result) => {
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
const getBookcheckByIDAsync = async (request, response) => {
    try {
        const id = request.params.id
        const result = await dbcheckbooks.get_bookcheck_by_id_async(id)
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}
// Create a bookcheck
const createBookCheck = (request, response) => {
    const {borroweddate, expireddate, realdate, iduser, idbook, numberofbook} = request.body;
    dbcheckbooks.create_bookcheck([borroweddate, expireddate, realdate, iduser, idbook, numberofbook],
        (error, result) => {
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
                CreatedBookCheckId: result.rows[0].new_id
            }
            response.status(201).json(res);
        })
}
const createBookCheckAsync = async (request, response) => {
    try {
        const {borroweddate, expireddate, realdate, iduser, idbook, numberofbook} = request.body;
        const result = await dbcheckbooks.create_bookcheck_async(borroweddate, expireddate, realdate, iduser, idbook, numberofbook)
        let res = {
            State: State.SUCCESS,
            CreatedBookCheckId: result.rows[0].new_id
        }
        console.log("id: " + result.rows[0].new_id)
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

//Update a bookcheck
const updateBookCheck = (request, response) => {
    const id = request.params.id;
    const {borroweddate, expireddate, numberofbook, iduser, idbook, realdate} = request.body;
    dbcheckbooks.update_bookcheck([borroweddate, expireddate, numberofbook, iduser, idbook, realdate, id], (error, result) => {
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
            UpdatedBookCheckId: id
        }
        response.status(201).json(res);
    })
}
const updateBookCheckAsync = async (request, response) => {
    try {
        const id = request.params.id;
        const {borroweddate, expireddate, numberofbook, iduser, idbook, realdate} = request.body;
        const result = await dbcheckbooks.update_bookcheck_async(borroweddate, expireddate, numberofbook, iduser, idbook, realdate, id)
        let res = {
            State: State.SUCCESS,
            UpdatedBookCheckId: id
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

//Delete a bookcheck
const deleteBookCheck = (request, response) => {
    const id = request.params.id
    dbcheckbooks.delete_bookcheck(id, (error, result) => {
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
            DeletedBookCheckId: id
        }
        response.status(201).json(res);
    })
}
const deleteBookCheckAsync = async (request, response) => {
    try{
        const id = request.params.id
        const result = await dbcheckbooks.delete_bookcheck_async(id)
        let res = {
            State: State.SUCCESS,
            DeletedBookCheckId: id
        }
        response.status(201).json(res);
    } catch(error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}

//The number of users' report
const getNumberOfUsers = (request, response) => {
    dbreport.get_number_of_users((error, result) => {
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
const getNumberOfUsersAsync = async (request, response) => {
    try {
        const result = await dbreport.get_number_of_users_async()
        response.status(200).json(result.rows);
    } catch(error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}

//The number of users' gender report
const getNumberOfUsersByGender = (request, response) => {
    dbreport.get_number_of_users_by_gender((error, result) => {
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
const getNumberOfUsersByGenderAsync = async (request, response) => {
    try {
        const result = await dbreport.get_number_of_users_by_gender_async()
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}

//The number of books' report
const getNumberOfBooks = (request, response) => {
    dbreport.get_number_of_books((error, result) => {
        if (error) {
            console.error(err);
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
const getNumberOfBooksAsync = async (request, response) => {
    try{
        const result = await dbreport.get_number_of_books_async()
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(err);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}

//The number of borrowed books' report
const getNumberOfBorrowedBooks = (request, response) => {
    dbreport.get_number_of_borrowed_books((error, result) => {
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
const getNumberOfBorrowedBooksAsync = async (request, response) => {
    try {
        const result = await dbreport.get_number_of_borrowed_books_async()
        response.status(200).json(result.rows);
    } catch(error) {
        console.error(error);
            let err = {
                State: State.ERROR,
                ErrorMessage: "Error occurs when execute query on database"
            }
            response.status(500).json(err);
    }
}

//The number of books by categories' report
const getNumberOfBooksByCategories = (request, response) => {
    dbreport.get_number_of_books_by_categories((error, result) => {
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
const getNumberOfBooksByCategoriesAsync = async (request, response) => {
    try {
        const result = await dbreport.get_number_of_books_by_categories_async()
        response.status(200).json(result.rows);
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
    getUsers,
    getUsersAsync,
    getUserByID,
    getUserByIDAsync,
    createUser,
    createUserAsync,
    updateUser,
    updateUserAsync,
    deleteUser,
    deleteUserAsync,
    getBooks,
    getBooksAsync,
    getBookByID,
    getBookByIDAsync,
    createBook,
    createBookAsync,
    updateBook,
    updateBookAsync,
    deleteBook,
    deleteBookAsync,
    getCategories,
    getCategoriesAsync,
    getCategoryByID,
    getCategoryByIDAsync,
    createCategory,
    createCategoryAsync,
    updateCategory,
    updateCategoryAsync,
    deleteCategory,
    deleteCategoryAsync,
    getNumberOfUsersByGender,
    getBookChecks,
    getBookChecksAsync,
    getBookChecksByID,
    getBookcheckByIDAsync,
    createBookCheck,
    createBookCheckAsync,
    updateBookCheck,
    updateBookCheckAsync,
    deleteBookCheck,
    deleteBookCheckAsync,
    getNumberOfUsers,
    getNumberOfUsersAsync,
    getNumberOfUsersByGender,
    getNumberOfUsersByGenderAsync,
    getNumberOfBooks,
    getNumberOfBooksAsync,
    getNumberOfBorrowedBooks,
    getNumberOfBorrowedBooksAsync,
    getNumberOfBooksByCategories,
    getNumberOfBooksByCategoriesAsync
  }