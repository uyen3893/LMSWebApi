const dbusers = require('./dbusers')
const sql = require('./sql')

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
    try {
        const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
        const result = await dbusers.create_user_async(birthdate, signupdate, name, cmnd, email, gender, expirydate)
        let res = {
            State: State.SUCCESS,
            InsertedUserId: result.rows[0].new_id
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
    try {
        const id = request.params.id;
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
  }