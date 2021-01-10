
const sql = require('./sql')
const dbcategories = require('./dbcategories')
const responseEnums = require('./responseEnums')


//Get the list of category
const get_categories_method = (request, response) => {
    dbcategories.get_categories((error, result) => {
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
const get_categories_method_async = async (request, response) => {
    try {
        const result = await dbcategories.get_categories_async()
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

//Get a category by ID
const get_category_by_id_method = (request, response) => {
    const id = request.params.id;
    dbcategories.get_category_by_id(id, (error, result) => {
        if (error) {
            console.error(error);
            let err = {
                State: responseEnums.State.ERROR,
                Error_Message: responseEnums.Error_Message.ERROR
            }
            response.status(500).json(err);
            return;
        }
        response.status(200).json(result.rows)
    })
}

const get_category_by_id_method_async = async (request, response) => {
    const id = request.params.id;
    if (id.length != 36) {
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.INVALID
        }
        response.status(500).json(err);
    } else {
        const result = await dbcategories.get_category_by_id_async(id)
        if (result.rows.length != 0) {
            try {
                response.status(200).json(result.rows)
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
    }

}
//Create a new category
const create_category_method = (request, response) => {
    const {name} = request.body
    dbcategories.create_category(name, (error, result) => {
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
            Created_Category_Id: result.rows[0].new_id
        }
        response.status(201).json(res);
    })
}
const create_category_method_async = async (request, response) => {
    try {
        const {name} = request.body
        const result = await dbcategories.create_category_async(name)
        let res = {
            State: responseEnums.State.SUCCESS,
            Created_Category_Id: result.rows[0].new_id
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

//Update category
const update_category_method = (request, response) => {
    const id = request.params.id;
    const {name} = request.body;
    dbcategories.update_category([name, id], (error, result) => {
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
            Updated_Category_Id: id
        }
        response.status(200).json(res);
    })
}
const update_category_method_async = async (request, response) => {
    const id = request.params.id;
    if(id.length != 36) {
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.INVALID
        }
        response.status(500).json(err);
    } else {
        const finding_category = await dbcategories.get_category_by_id_async(id)
        if(finding_category.rows.length != 0) {
            try {
                const {name} = request.body;
                const result = await dbcategories.update_category_async(name, id)
                let res = {
                    State: responseEnums.State.SUCCESS,
                    Updated_Category_Id: id
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
        
    }
    
}

//Delete category
const delete_category_method = (request, response) => {
    const id = request.params.id
    dbcategories.delete_category(id, (error, result) => {
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
            Deleted_Category_Id: id
        }
        response.status(200).json(res);
    })
}

const delete_category_method_async = async (request, response) => {
    const id = request.params.id
    if (id.length != 36) {
        let err = {
            State: responseEnums.State.ERROR,
            Error_Message: responseEnums.Error_Message.INVALID
        }
        response.status(500).json(err);
    } else {
        const finding_category = await dbcategories.get_category_by_id_async(id)
        if(finding_category.rows.length != 0) {
            try {
                const result = await dbcategories.delete_category_async(id)
                let res = {
                    State: responseEnums.State.SUCCESS,
                    Deleted_Category_Id: id
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
    }
    
}

module.exports = {
    get_categories_method,
    get_categories_method_async,
    get_category_by_id_method,
    get_category_by_id_method_async,
    create_category_method,
    create_category_method_async,
    update_category_method,
    update_category_method_async,
    delete_category_method,
    delete_category_method_async
}