
const sql = require('./sql')
const dbreport = require('./dbreport')
const responseEnums = require('./responseEnums')

//The number of users' report
const get_number_of_users_method = (request, response) => {
    dbreport.get_number_of_users((error, result) => {
        if (error) {
            console.error(error)
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows);
    })
}
const get_number_of_users_method_async = async (request, response) => {
    try {
        const result = await dbreport.get_number_of_users_async()
        response.status(200).json(result.rows);
    } catch(error) {
        console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
    }
}

//The number of users' gender report
const get_number_of_users_by_gender_method = (request, response) => {
    dbreport.get_number_of_users_by_gender((error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows);
    })
}
const get_number_of_users_by_gender_method_async = async (request, response) => {
    try {
        const result = await dbreport.get_number_of_users_by_gender_async()
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
    }
}

//The number of books' report
const get_number_of_books_method = (request, response) => {
    dbreport.get_number_of_books((error, result) => {
        if (error) {
            console.error(err);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows);
    })
}
const get_number_of_books_method_async = async (request, response) => {
    try{
        const result = await dbreport.get_number_of_books_async()
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(err);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
    }
}

//The number of borrowed books' report
const get_number_of_borrowed_books_method = (request, response) => {
    dbreport.get_number_of_borrowed_books((error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows);
    })
}
const get_number_of_borrowed_books_method_async = async (request, response) => {
    try {
        const result = await dbreport.get_number_of_borrowed_books_async()
        response.status(200).json(result.rows);
    } catch(error) {
        console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
    }
}

//The number of books by categories' report
const get_number_of_books_by_categories_method = (request, response) => {
    dbreport.get_number_of_books_by_categories((error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows);
    })
}
const get_number_of_books_by_categories_method_async = async (request, response) => {
    try {
        const result = await dbreport.get_number_of_books_by_categories_async()
        response.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
    }
}

module.exports = {
    get_number_of_users_method,
    get_number_of_users_method_async,
    get_number_of_users_by_gender_method,
    get_number_of_users_by_gender_method_async,
    get_number_of_books_method,
    get_number_of_books_method_async,
    get_number_of_borrowed_books_method,
    get_number_of_borrowed_books_method_async,
    get_number_of_books_by_categories_method,
    get_number_of_books_by_categories_method_async
}
