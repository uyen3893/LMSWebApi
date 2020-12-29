require('dotenv').config()
const assert = require('assert')
const dbusers = require('../dbusers')
const axios = require('axios')

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
const wrong_id = '00000000-0000-0000-0000-000000000000'


describe("users api", async() => {
    let new_user_id = null;
    let user_id_for_update_testcase = null
    let user_id_for_delete_testcase = null
    let user_id_for_create_testcase = null
    before (async() => {
        const result = await dbusers.create_user_async(birthdate, signupdate, name, cmnd, email, gender, expirydate)
        new_user_id = result.rows[0].new_id
        const result_for_update = await dbusers.create_user_async(birthdate, signupdate, name, cmnd, email, gender, expirydate)
        user_id_for_update_testcase = result.rows[0].new_id
        const result_for_delete = await dbusers.create_user_async(birthdate, signupdate, name, cmnd, email, gender, expirydate)
        user_id_for_delete_testcase = result.rows[0].new_id
    })
    describe('get users', async() => {
        it("1. should return status code 200 and the number of data response is equal the number of users in database when called correctly", async () => {
            let response = await axios.get( `${process.env.API_URL}/users`);
            let apiUsersCount = response.data.length;
            const result = await dbusers.count_number_of_users_async()
            const dbUsersCount = result.rows[0].count;
            assert.strictEqual(apiUsersCount, parseInt(dbUsersCount));
            assert.strictEqual(response.status, 200);
        });
    })

    describe("get user by ID" , async() => {
        it('2. should return status 200 and correct user when called correctly', async() => {
            const response = await axios.get(`${process.env.API_URL}/users/${new_user_id}`);
            let apiUser = response.data[0];
            const resultFromData = await dbusers.get_user_by_id_async(new_user_id)

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
        })
        it('3. should return status 500 and State will be error when called with incorrect id format', async() => {
            await axios.get( `${process.env.API_URL}/users/${wrong_id}`).catch(error=>{
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })
        })
        it('4. should return status 200 and empty array when called with incorrect id\'s value', async() => {
            const response = await axios.get( `${process.env.API_URL}/users/${wrong_id}`)
            assert.strictEqual(response.data.length, 0)
            assert.strictEqual(response.status, 200)
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
            user_id_for_create_testcase = response.data.InsertedUserId
            const result = await dbusers.get_user_by_id_async(user_id_for_create_testcase)
            const dbUser = result.rows[0];
            assert.strictEqual(dbUser.name, name);
            assert.strictEqual(dbUser.cmnd, cmnd);
            assert.strictEqual(dbUser.gender, gender);
            assert.strictEqual(dbUser.birthdate.toISOString(), birthdate.toISOString());
            assert.strictEqual(dbUser.email, email);
            assert.strictEqual(dbUser.signupdate.toISOString(), signupdate.toISOString());
            assert.strictEqual(dbUser.expirydate.toISOString(), expirydate.toISOString());
    
            assert.strictEqual(response.status, 201)
        })
        it('6. should return status 500 and State will be error when called with incorrect parameters', async() => {
            await axios.post(`${process.env.API_URL}/users`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })
        })
    })

    describe('update user', async() => {
        it('7. should return status 200 and change user\'s information when called correctly', async() => {
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
            const response = await axios.put(`${process.env.API_URL}/users/${user_id_for_update_testcase}`, 
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
            assert.strictEqual(response.data.UpdatedUserId, user_id_for_update_testcase)

            const updatedResult = await dbusers.get_user_by_id_async(user_id_for_update_testcase)
            const dbUser = updatedResult.rows[0];
            assert.strictEqual(dbUser.name, updatedName);
            assert.strictEqual(dbUser.cmnd, updatedCmnd);
            assert.strictEqual(dbUser.gender, updatedGender);
            assert.strictEqual(dbUser.birthdate.toISOString(), updatedBirthDate.toISOString());
            assert.strictEqual(dbUser.email, updatedEmail);
            assert.strictEqual(dbUser.signupdate.toISOString(), updatedSignUpDate.toISOString());
            assert.strictEqual(dbUser.expirydate.toISOString(), updatedExpiryDate.toISOString());

        })

        it('8. should return status 500 and State will be error when called incorrectly', async() => {
            await axios.put(`${process.env.API_URL}/users/${user_id_for_update_testcase}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })
        })
        
        it('9. should return status 500 and State will be error when called with wrong id\'s value', async() => {
            await axios.put(`${process.env.API_URL}/users/${wrong_id}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, 'Cannot find this user in the database')
            })
        })
        
    })
    describe('delete user', async() => {
        it('9. should return status 200 and delete user when called successfully', async() => {
            const response = await axios.delete( `${process.env.API_URL}/users/${user_id_for_delete_testcase}`)
            const dbResult = await dbusers.get_user_by_id_async(user_id_for_delete_testcase)
            assert.strictEqual(dbResult.rowCount, 0)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, State.SUCCESS)
            assert.strictEqual(response.data.DeletedUserId, user_id_for_delete_testcase)
        })
        it('10. should return status 500 and State will be error when called with wrong id\'s format', async() => {
            const response = await axios.delete( `${process.env.API_URL}/users/1`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, ErrorResponseMessage)
            })
        })
        it('11.should return status 500 and State will be error when called with wrong id\'s value', async() => {
            const response = await axios.delete(`${process.env.API_URL}/users/${wrong_id}`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, State.ERROR)
                assert.strictEqual(error.response.data.ErrorMessage, 'Cannot find this user in the database')
            })
        })
    })

    after(async() => {
        await dbusers.delete_user_async(new_user_id)
        await dbusers.delete_user_async(user_id_for_delete_testcase)
        await dbusers.delete_user_async(user_id_for_update_testcase)
        await dbusers.delete_user_async(user_id_for_create_testcase)
    })
})
