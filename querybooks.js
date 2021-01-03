
const dbbooks = require('./dbbooks')
const dbcategories = require('./dbcategories')
const sql = require('./sql')
const responseEnums = require('./responseEnums')


//Get list of books
const get_books_method = (request, response) => {
    dbbooks.get_books((error, result) => {
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

const get_book_method_async = async (request, response) => {
    try {
        const result = await dbbooks.get_books_async()
        response.status(200).json(result.rows)
    } catch (error) {
        console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
    }
    
}

//Get a book by ID
const get_book_by_id_method = (request, response) => {
    const id = request.params.id
    dbbooks.get_book_by_id(id, (error, result) => {
        if(error) {
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
const get_book_by_id_method_async = async (request, response) => {
    const id = request.params.id
    try {
        const result = await dbbooks.get_book_by_id_async(id)
        response.status(200).json(result.rows)
    } catch(error) {
        console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
    }
}

//Create a book
const create_book_method = (request, response) => {
    const {name, isbn, author, publisher, quantity, id_category} = request.body;
    dbbooks.create_book([isbn, name, author, publisher, quantity, id_category], (error, result) => {
        if(error) {
            console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
            return;
        }
        let res = {
            State: responseEnums.State.SUCCESS,
            Created_Book_Id: result.rows[0].new_id
        }
        response.status(201).json(res);
    })
}

const create_book_method_async = async (request, response) => {
    const {name, isbn, author, publisher, quantity, id_category} = request.body;
    try {
        const result = await dbbooks.create_book_async(isbn, name, author, publisher, quantity, id_category)
        let res = {
            State: responseEnums.State.SUCCESS,
            Created_Book_Id: result.rows[0].new_id
        }
        response.status(201).json(res);
    } catch (error) {
        console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
    }
}
//Update a book
const update_book_method = (request, response) => {
    const id = request.params.id;
    const {name, isbn, author, publisher, quantity, id_category} = request.body;
    dbbooks.update_book([isbn, name, author, publisher, quantity, id_category, id], (error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
            return;
        }
        let res = {
            State: responseEnums.State.SUCCESS,
            Updated_Book_Id: id
        }
        response.status(200).json(res);
    })
}
const update_book_method_async = async (request, response) =>{
    const id = request.params.id;
    const {name, isbn, author, publisher, quantity, id_category} = request.body;
        const get_book_by_id_result = await dbbooks.get_book_by_id_async(id)
        if (get_book_by_id_result.rows.length !=0 ) {
            const check_id_category = await dbcategories.get_category_by_id_async(id_category)
            if(check_id_category.rows.length != 0) {
                try {
                    const result = await dbbooks.update_book_async(isbn, name, author, publisher, quantity, id_category, id)
                    let res = {
                        State: responseEnums.State.SUCCESS,
                        Updated_Book_Id: id
                    }
                    response.status(200).json(res);
                } catch (error) {
                    console.error(error);
                        let err = {
                            State: responseEnums.State.ERROR,
                            Error_Message: responseEnums.Error_Message.ERROR
                        }
                        response.status(500).json(err);
                }
            } else {
                let err = {
                    State: responseEnums.State.ERROR,
                    Error_Message: responseEnums.Error_Message.FINDING_ERROR('category')
                }
                response.status(500).json(err);
            }
        } else {
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.FINDING_ERROR('book')
            }
            response.status(500).json(err);
        }
    
}

//Delete a book
const delete_book_method = (request, response) => {
    const id = request.params.id;
    dbbooks.delete_book(id, (error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
            return;
        }
        let res = {
            State: responseEnums.State.SUCCESS,
            Deleted_Book_Id: id
        }
        response.status(200).json(res);
    })
}

const delete_book_method_async = async (request, response) => {
    const id = request.params.id
    if (id.length != 36) {
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.INVALID
        }
        response.status(500).json(err);
    } else {
        try {
            let db_result = await dbbooks.get_book_by_id_async(id)
            if(db_result.rows.length != 0) {
                const result = await dbbooks.delete_book_async(id)
                let res = {
                State: responseEnums.State.SUCCESS,
                Deleted_Book_Id: id
                }
                response.status(200).json(res)
            } else {
                let res = {
                    State: responseEnums.State.ERROR,
                    Error_Message: responseEnums.Error_Message.FINDING_ERROR('book')
                }
                response.status(500).json(res)
            }
            
        } catch (error) {
            console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
        }
    }
}

module.exports = {
    get_books_method,
    get_book_method_async,
    get_book_by_id_method,
    get_book_by_id_method_async,
    create_book_method,
    create_book_method_async,
    update_book_method,
    update_book_method_async,
    delete_book_method,
    delete_book_method_async
}
