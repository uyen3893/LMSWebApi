
const dbbookchecks = require('./dbbookchecks');
const dbbooks = require('./dbbooks');
const dbusers = require('./dbusers');
const responseEnums = require('./responseEnums')

//Get the list of bookchecks
const get_bookchecks_method = (request, response) => {
    dbbookchecks.get_bookchecks((error, result) => {
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

const get_bookchecks_method_async = async (request, response) => {
    try {
        const result = await dbbookchecks.get_bookcheck_async()
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
//Get the list of bookcheck by ID
const get_bookcheck_by_id_method = (request, response) => {
    const id = request.params.id
    dbbookchecks.get_bookcheck_by_id(id, (error, result) => {
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
const get_bookcheck_by_id_method_async = async (request, response) => {
    const id = request.params.id
    if (id.length != 36) {
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.INVALID
        }
        response.status(500).json(err);
    } else {
        const result = await dbbookchecks.get_bookcheck_by_id_async(id)
        if(result.rows.length != 0) {
            try {
                const result = await dbbookchecks.get_bookcheck_by_id_async(id)
                response.status(200).json(result.rows);
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
                Error_Message: responseEnums.Error_Message.FINDING_ERROR('bookcheck')
            }
            response.status(500).json(err);
        }
        
    }
    
}
// Create a bookcheck
const create_bookcheck_method = (request, response) => {
    const {borroweddate, expireddate, realdate, iduser, idbook, numberofbook} = request.body;
    dbbookchecks.create_bookcheck([borroweddate, expireddate, realdate, iduser, idbook, numberofbook],
        (error, result) => {
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
                Created_BookCheck_Id: result.rows[0].new_id
            }
            response.status(201).json(res);
        })
}
const create_bookcheck_method_async = async (request, response) => {
    const {borroweddate, expireddate, realdate, iduser, idbook, numberofbook} = request.body;
    if(borroweddate != null && expireddate != null && realdate != null && iduser != null && idbook != null && numberofbook != null ) {
        const user_result = await dbusers.get_user_by_id_async(iduser)
        if(user_result.rows.length != 0) {
            const book_result = await dbbooks.get_book_by_id_async(idbook)
            if(book_result.rows.length != 0) {
                try {
                    const result = await dbbookchecks.create_bookcheck_async(borroweddate, expireddate, realdate, iduser, idbook, numberofbook)
                    let res = {
                        State: responseEnums.State.SUCCESS,
                        Created_BookCheck_Id: result.rows[0].new_id
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
            } else {
                let err = {
                    State: responseEnums.State.ERROR,
                    Error_Message: responseEnums.Error_Message.FINDING_ERROR('book')
                }
                response.status(500).json(err);
            }
                
        } else {
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.FINDING_ERROR('user')
            }
            response.status(500).json(err);
        }
    } else {
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.ERROR
        }
        response.status(500).json(err);
    }
    
    
}

//Update a bookcheck
const update_bookcheck_method = (request, response) => {
    const id = request.params.id;
    const {borroweddate, expireddate, numberofbook, iduser, idbook, realdate} = request.body;
    dbbookchecks.update_bookcheck([borroweddate, expireddate, numberofbook, iduser, idbook, realdate, id], (error, result) => {
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
            Updated_BookCheck_Id: id
        }
        response.status(200).json(res);
    })
}
const update_bookcheck_method_async = async (request, response) => {
    const id = request.params.id;
    if (id.length != 36) {
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.INVALID
        }
        response.status(500).json(err);

    } else {
        const {borroweddate, expireddate, numberofbook, iduser, idbook, realdate} = request.body;
        const bookcheck_result = await dbbookchecks.get_bookcheck_by_id_async(id)
        if (bookcheck_result.rows.length != 0) {
            const user_result = await dbusers.get_user_by_id_async(iduser)
            if (user_result.rows.length != 0) {
                const book_result = await dbbooks.get_book_by_id_async(idbook)
                if(book_result.rows.length != 0) {
                    try {
                        const result = await dbbookchecks.update_bookcheck_async(borroweddate, expireddate, numberofbook, iduser, idbook, realdate, id)
                        let res = {
                            State: responseEnums.State.SUCCESS,
                            Updated_BookCheck_Id: id
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
                        Error_Message: responseEnums.Error_Message.FINDING_ERROR('book')
                    }
                    response.status(500).json(err);
                }
                
            } else {
                let err = {
                    State: responseEnums.State.ERROR,
                    Error_Message: responseEnums.Error_Message.FINDING_ERROR('user')
                }
                response.status(500).json(err);
            }
            
        } else {
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.FINDING_ERROR('bookcheck')
            }
            response.status(500).json(err);
        }
    }
    
}

//Delete a bookcheck
const delete_bookcheck_method = (request, response) => {
    const id = request.params.id
    dbbookchecks.delete_bookcheck(id, (error, result) => {
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
            Deleted_BookCheck_Id: id
        }
        response.status(200).json(res);
    })
}
const delete_bookcheck_method_async = async (request, response) => {
    const id = request.params.id
    if(id.length != 36) {
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.INVALID
        }
        response.status(500).json(err);
    } else {
        const bookcheck_result = await dbbookchecks.get_bookcheck_by_id_async(id)
        if (bookcheck_result.rows.length != 0) {
            try{
                const result = await dbbookchecks.delete_bookcheck_async(id)
                let res = {
                    State: responseEnums.State.SUCCESS,
                    Deleted_BookCheck_Id: id
                }
                response.status(200).json(res);
            } catch(error) {
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
                Error_Message: responseEnums.Error_Message.FINDING_ERROR('bookcheck')
            }
            response.status(500).json(err);
        }
    }
    
}

module.exports = {
    get_bookchecks_method,
    get_bookchecks_method_async,
    get_bookcheck_by_id_method,
    get_bookcheck_by_id_method_async,
    create_bookcheck_method,
    create_bookcheck_method_async,
    update_bookcheck_method,
    update_bookcheck_method_async,
    delete_bookcheck_method,
    delete_bookcheck_method_async
}


