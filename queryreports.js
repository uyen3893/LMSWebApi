
const sql = require('./sql')
const dbreport = require('./dbreport')

const State = {
    SUCCESS: "Success",
    ERROR: "Error"
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
    getNumberOfUsersByGender,
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
