const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'LMS',
  password: '123456789',
  port: 5432,
})

//Get the list of users
const getUsers = (request, response) => {
    pool.query('SELECT * FROM public.users', (error, results) => {
        if(error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
}

//Get the name of user by ID
const getUserID = (request, response) => {
    const id = request.params.id;
    pool.query('SELECT * FROM users WHERE id = $id', (error, results) => {
        if(error) {
            throw error;
        }
        response.status(200).json(results.rows);
    })
}

//Post a new user
const postUser = (request, response) => {
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    pool.query('INSERT INTO users(name, gender, cmnd, email, birthdate, signupdate, expirydate) VALUE ($name, $gender, $email, $birthdate, $signupdate, $expiredate)', (error, result) => {
        if(error) {
            throw error;
        }
        response.status(201).send('User added with ID: ${result.insertID}');
    })

}

//Update a user
const updateUser = (request, response) => {
    const id = request.params.id;
    const {name, gender, cmnd, email, birthdate, signupdate, expirydate} = request.body;
    pool.query('UPDATE users SET name = $name, cmnd = $cmnd, email = $email, gender = $gender, birthdate = $birthdate where id = $id', (error, result) => {
        if(error) {
            throw error;
        }
        response.status(200).send(`User modified with ID: ${id}`);
    })
}

//Delete a user
const deleteUser = (request, response) => {
    const id = request.params.id;
    pool.query('DELETE FROM users WHERE id = $id', (error, results) => {
        if(error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    })
}

module.exports = {
    getUsers,
    getUserID,
    postUser,
    updateUser,
    deleteUser,
  }