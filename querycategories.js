const Pool = require('pg').Pool
const sql = require('./sql')
const dbcategories = require('./dbcategories')

const State = {
    SUCCESS: "Success",
    ERROR: "Error"
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
        response.status(200).json(res);
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
        response.status(200).json(res);
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
    getCategories,
    getCategoriesAsync,
    getCategoryByID,
    getCategoryByIDAsync,
    createCategory,
    createCategoryAsync,
    updateCategory,
    updateCategoryAsync,
    deleteCategory,
    deleteCategoryAsync
}