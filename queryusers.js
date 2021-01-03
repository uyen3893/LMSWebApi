const dbusers = require('./dbusers')
const sql = require('./sql')
const responseEnums = require('./responseEnums')

//Get the list of users
const get_users_method = (request, response) => {
    dbusers.get_users((error, result) => {
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
const get_users_method_async = async (request, response) => {
    try {
        const result = await dbusers.get_users_async()
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

//Get the name of user by ID
const get_user_by_id_method = (request, response) => {
    const id = request.params.id;
    dbusers.get_user_by_id(id, (error, result) => {
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
const get_user_by_id_method_async = async (request, response) => {
    const id = request.params.id;
    try {
        const result = await dbusers.get_user_by_id_async(id)
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

//Create a new user
const create_user_method = (request, response) => {
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    dbusers.create_user([birthdate, signupdate, name, cmnd, email, gender, expirydate], (error, result) => {
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
            Created_User_Id: result.rows[0].new_id
        }
        response.status(201).json(res);
    })
}

const create_user_method_async = async (request, response) => {
    try {
        const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
        const result = await dbusers.create_user_async(birthdate, signupdate, name, cmnd, email, gender, expirydate)
        let res = {
            State: responseEnums.State.SUCCESS,
            Created_User_Id: result.rows[0].new_id
        }
        response.status(201).json(res);
    } catch(error) {
        console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
    } 
}

//Update a user

const update_user_method = (request, response) => {
    const id = request.params.id;
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    dbusers.update_user([name, cmnd, email, gender, birthdate, signupdate, expirydate, id], (error, result) => {
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
            Error_Message: id
        }
        response.status(200).json(res);
    })
}
const update_user_method_async = async (request, response) => {
    const id = request.params.id;
    if(id.length != 36){
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.INVALID
        }
        response.status(500).json(err)
    } else {
        const valid_user = await dbusers.get_user_by_id_async(id)
        if(valid_user.rows.length != 0) {
            try {
                const id = request.params.id;
                const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
                const result = await dbusers.update_user_async(name, cmnd, email, gender, birthdate, signupdate, expirydate, id)
                let res = {
                    State: responseEnums.State.SUCCESS,
                    Updated_User_Id: id
                }
                response.status(200).json(res);
            } catch (error) {
                console.log(error)
                let err = {
                    State: responseEnums.State.ERROR,
                    Error_Message: responseEnums.Error_Message.INVALID
                }
                response.status(500).json(err)
            }
        } else {
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.FINDING_ERROR('user')
            }
            response.status(500).json(err)
        }
    }
    
}

//Delete a user
const delete_user_method = (request, response) => {
    const id = request.params.id;
    dbusers.delete_user(id, (error, result) => {
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
            Deleted_User_Id: id
        }
        response.status(200).json(res);
    })
}

const delete_user_method_async = async (request, response) => {
    const id = request.params.id;
    if (id.length != 36) {
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.ERROR
        }
        response.status(500).json(err);
    } else {
        try {
            const db_result = await dbusers.get_user_by_id_async(id)
            if(db_result.rows.length != 0) {
                const result = await dbusers.delete_user_async(id)
                let res = {
                State: responseEnums.State.SUCCESS,
                Deleted_User_Id: id
                }
                response.status(200).json(res);
            } else {
                let res = {
                    State: responseEnums.State.ERROR,
                    Error_Message: responseEnums.Error_Message.ERROR
                }
                response.status(500).json(res)
            }
            
        } catch(error) {
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
    get_users_method,
    get_users_method_async,
    get_user_by_id_method,
    get_user_by_id_method_async,
    create_user_method,
    create_user_method_async,
    update_user_method,
    update_user_method_async,
    delete_user_method,
    delete_user_method_async
  }