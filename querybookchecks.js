
const dbcheckbooks = require('./dbcheckbooks')

const State = {
    SUCCESS: "Success",
    ERROR: "Error"
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
        response.status(200).json(res);
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
        response.status(200).json(res);
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

module.exports = {
    getBookChecks,
    getBookChecksAsync,
    getBookChecksByID,
    getBookcheckByIDAsync,
    createBookCheck,
    createBookCheckAsync,
    updateBookCheck,
    updateBookCheckAsync,
    deleteBookCheck,
    deleteBookCheckAsync
}


