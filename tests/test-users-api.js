require('dotenv').config()
const assert = require('assert');
const Pool = require('pg').Pool

const axios = require('axios')
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})
const State = {
    SUCCESS: "Success",
    ERROR: "Error"
}
const ErrorResponseMessage = "Error occurs when execute query on database"

const birthdate = new Date(1999, 01, 01)
const signupdate = new Date(2020, 05, 05)
const expirydate = new Date(2023, 05, 05)
const name = 'Nguyen Van X'
const gender = true
const email = 'x@email.com'
const cmnd = '82764619'



describe("users api", function() {
    describe('get users', async() => {
        it("1. should return status code 200 and the number of data response is equal the number of users in database when called correctly", async () => {
            let response = await axios.get( `${process.env.API_URL}/users`);
            let apiUsersCount = response.data.length;
            pool.query('SELECT COUNT(1) FROM users', (error,result) => {
                if(error) {
                    throw error;
                }
                const dbUsersCount = result.rows[0].count;
                assert.strictEqual(apiUsersCount, parseInt(dbUsersCount));
            })
            assert.strictEqual(response.status, 200);
        });
    })

    describe("get user by ID" , async() => {
        it('2. should return status 200 and correct user when called correctly', async() => {
            const result = await pool.query('SELECT public."InsertUser"($1, $2, $3, $4, $5, $6, $7) as new_id', 
            [birthdate, signupdate, name, cmnd, email, gender, expirydate])
            var new_user_id = result.rows[0].new_id;
            console.log("id: " + new_user_id)
            const response = await axios.get( `${process.env.API_URL}/users/${new_user_id}`);
            let apiUser = response.data[0];
            const resultFromData = await pool.query('SELECT * FROM users WHERE id = $1', [new_user_id])

            const dbUser = resultFromData.rows[0];
            assert.strictEqual(apiUser.id, dbUser.id);
            assert.strictEqual(apiUser.name, dbUser.name);
            assert.strictEqual(apiUser.cmnd, dbUser.cmnd);
            assert.strictEqual(apiUser.gender, dbUser.gender);
            assert.strictEqual(apiUser.birthdate, dbUser.birthdate.toISOString());
            assert.strictEqual(apiUser.email, dbUser.email);
            assert.strictEqual(apiUser.signupdate, dbUser.signupdate.toISOString());
            assert.strictEqual(apiUser.expirydate, dbUser.expirydate.toISOString());
            
            assert.strictEqual(response.status, 200);
            await pool.query('CALL public."DeleteUser" ($1)', [new_user_id])
        })
        it('3. should return status 500 and State will be error when called with incorrect id format', async() => {
            var new_user_id;
            const result = await pool.query('SELECT public."InsertUser"($1, $2, $3, $4, $5, $6, $7) as new_id', 
            [birthdate, signupdate, name, cmnd, email, gender, expirydate])
            new_user_id = result.rows[0].new_id + '1';
            console.log("id: " + new_user_id)
            await axios.get( `${process.env.API_URL}/users/${new_user_id}`).catch(error=>{
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })
            await pool.query('CALL public."DeleteUser" ($1)', [result.rows[0].new_id])
        })
        it('4. should return status 500 and response will be error when called with incorrect id\'s value', async() => {
            var new_user_id;
            const result = await pool.query('SELECT public."InsertUser"($1, $2, $3, $4, $5, $6, $7) as new_id', 
            [birthdate, signupdate, name, cmnd, email, gender, expirydate])
            new_user_id = result.rows[0].new_id.substring(0,35) + '1'
            console.log("id : " + new_user_id)
            const response = await axios.get( `${process.env.API_URL}/users/${new_user_id}`)
            assert.strictEqual(response.data.length, 0)
            assert.strictEqual(response.status, 200)
            await pool.query('CALL public."DeleteUser" ($1)', [result.rows[0].new_id])
        })
    })

    describe('create user', async() => {
        it('5. should return status 201 and successfully create new user', async() => {
            const response = await axios.post(`${process.env.API_URL}/users`, {
                name: name,
                gender: gender,
                cmnd: cmnd,
                email: email,
                birthdate: birthdate.toLocaleDateString(),
                signupdate: signupdate.toLocaleDateString(),
                expirydate: expirydate.toLocaleDateString()
            })
            const result = pool.query('SELECT * FROM users WHERE id = $1', [response.data.InsertedUserId], (err, result) => {
                if(err) {
                    throw err;
                }
                const dbUser = result.rows[0];
                assert.strictEqual(dbUser.name, name);
                assert.strictEqual(dbUser.cmnd, cmnd);
                assert.strictEqual(dbUser.gender, gender);
                assert.strictEqual(dbUser.birthdate.toISOString(), birthdate.toISOString());
                assert.strictEqual(dbUser.email, email);
                assert.strictEqual(dbUser.signupdate.toISOString(), signupdate.toISOString());
                assert.strictEqual(dbUser.expirydate.toISOString(), expirydate.toISOString());
            })
            assert.strictEqual(response.status, 201)
            await pool.query('CALL public."DeleteUser" ($1)', [response.data.InsertedUserId])
        })
        it('6. should return status 500 and State will be error when called with incorrect parameters', async() => {
            await axios.post(`${process.env.API_URL}/users`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })
        })
    })

    describe('update user', async => {
        it('7. should return status 200 and change user\'s information when called correctly', async() => {
            const result = await pool.query('SELECT public."InsertUser"($1, $2, $3, $4, $5, $6, $7) as new_id', 
            [birthdate, signupdate, name, cmnd, email, gender, expirydate])
            const new_user_id = result.rows[0].new_id;
            const updatedName = 'Nguyen Van C'
            const updatedCmnd = '325323452'
            const updatedEmail = 'c@email.com'
            const updatedGender = true
            const updatedBirthDate = birthdate
            updatedBirthDate.setFullYear(birthdate.getFullYear() + 1)
            const updatedSignUpDate = signupdate
            updatedSignUpDate.setFullYear(signupdate.getFullYear() + 1)
            const updatedExpiryDate = expirydate
            updatedExpiryDate.setFullYear(expirydate.getFullYear() + 1)
            const response = await axios.put(`${process.env.API_URL}/users/${new_user_id}`, 
            {
                name: updatedName,
                cmnd: updatedCmnd,
                email: updatedEmail,
                gender: updatedGender,
                birthdate: updatedBirthDate.toLocaleDateString(),
                signupdate: updatedSignUpDate.toLocaleDateString(),
                expirydate: updatedExpiryDate.toLocaleDateString()
            })
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, State.SUCCESS)
            assert.strictEqual(response.data.UpdatedUserId, new_user_id)

            const updatedResult = await pool.query('SELECT * FROM users WHERE id = $1', [new_user_id])
            const dbUser = updatedResult.rows[0];
            assert.strictEqual(dbUser.name, updatedName);
            assert.strictEqual(dbUser.cmnd, updatedCmnd);
            assert.strictEqual(dbUser.gender, updatedGender);
            assert.strictEqual(dbUser.birthdate.toISOString(), updatedBirthDate.toISOString());
            assert.strictEqual(dbUser.email, updatedEmail);
            assert.strictEqual(dbUser.signupdate.toISOString(), updatedSignUpDate.toISOString());
            assert.strictEqual(dbUser.expirydate.toISOString(), updatedExpiryDate.toISOString());

            await pool.query('CALL public."DeleteUser" ($1)', [new_user_id])
        })

        it('8. should return status 500 and State will be error when called incorrectly', async() => {
            await axios.put(`${process.env.API_URL}/users/1`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })
        })
        
        
    })
    describe('delete user', async() => {
        it('9. should return status 200 and delete user when called successfully', async() => {
            const result = await pool.query('SELECT public."InsertUser"($1, $2, $3, $4, $5, $6, $7) as new_id', 
            [birthdate, signupdate, name, cmnd, email, gender, expirydate])
            var new_user_id = result.rows[0].new_id;
            const response = await axios.delete( `${process.env.API_URL}/users/${new_user_id}`)
            const dbResult = await pool.query('SELECT * FROM users WHERE id = $1', [new_user_id])
            assert.strictEqual(dbResult.rowCount, 0)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, State.SUCCESS)
            assert.strictEqual(response.data.DeletedUserId, new_user_id)
        })
        it('10. should return status 500 and State will be error when called incorrectly', async() => {
            const response = await axios.delete( `${process.env.API_URL}/users/1`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })

        })
    })
})
