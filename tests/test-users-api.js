require('dotenv').config()
const assert = require('assert')
const dbusers = require('../dbusers')
const axios = require('axios')
const message = require('../message')


const birth_date = new Date(1999, 01, 01)
const sign_up_date = new Date(2020, 05, 05)
const expiry_date = new Date(2023, 05, 05)
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
        const result = await dbusers.create_user_async(birth_date, sign_up_date, name, cmnd, email, gender, expiry_date)
        new_user_id = result.rows[0].new_id
        const result_for_update = await dbusers.create_user_async(birth_date, sign_up_date, name, cmnd, email, gender, expiry_date)
        user_id_for_update_testcase = result.rows[0].new_id
        const result_for_delete = await dbusers.create_user_async(birth_date, sign_up_date, name, cmnd, email, gender, expiry_date)
        user_id_for_delete_testcase = result.rows[0].new_id
    })
    describe('get users', async() => {
        it("1. should return status code 200 and the number of data response is equal the number of users in database when called correctly", async () => {
            let response = await axios.get( `${process.env.API_URL}/users`);
            let api_users_count = response.data.length;
            const result = await dbusers.count_number_of_users_async()
            const db_users_count = result.rows[0].count;
            assert.strictEqual(api_users_count, parseInt(db_users_count));
            assert.strictEqual(response.status, 200);
        });
    })

    describe("get user by ID" , async() => {
        it('2. should return status 200 and correct user when called correctly', async() => {
            const response = await axios.get(`${process.env.API_URL}/users/${new_user_id}`);
            let api_user = response.data[0];
            const result_from_data = await dbusers.get_user_by_id_async(new_user_id)

            const db_user = result_from_data.rows[0];
            assert.strictEqual(api_user.id, db_user.id);
            assert.strictEqual(api_user.name, db_user.name);
            assert.strictEqual(api_user.cmnd, db_user.cmnd);
            assert.strictEqual(api_user.gender, db_user.gender);
            assert.strictEqual(api_user.birthdate, db_user.birthdate.toISOString());
            assert.strictEqual(api_user.email, db_user.email);
            assert.strictEqual(api_user.signupdate, db_user.signupdate.toISOString());
            assert.strictEqual(api_user.expirydate, db_user.expirydate.toISOString());
            
            assert.strictEqual(response.status, 200);
        })
        it('3. should return status 500 and State will be error when called with incorrect id format', async() => {
            await axios.get( `${process.env.API_URL}/users/${wrong_id}`).catch(error=>{
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message)
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
                birthdate: birth_date.toLocaleDateString(),
                signupdate: sign_up_date.toLocaleDateString(),
                expirydate: expiry_date.toLocaleDateString()
            })
            user_id_for_create_testcase = response.data.Created_user_id
            const result = await dbusers.get_user_by_id_async(user_id_for_create_testcase)
            const dbUser = result.rows[0];
            assert.strictEqual(dbUser.name, name);
            assert.strictEqual(dbUser.cmnd, cmnd);
            assert.strictEqual(dbUser.gender, gender);
            assert.strictEqual(dbUser.birthdate.toISOString(), birth_date.toISOString());
            assert.strictEqual(dbUser.email, email);
            assert.strictEqual(dbUser.signupdate.toISOString(), sign_up_date.toISOString());
            assert.strictEqual(dbUser.expirydate.toISOString(), expiry_date.toISOString());
    
            assert.strictEqual(response.status, 201)
        })
        it('6. should return status 500 and State will be error when called with incorrect parameters', async() => {
            await axios.post(`${process.env.API_URL}/users`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message)
            })
        })
    })

    describe('update user', async() => {
        it('7. should return status 200 and change user\'s information when called correctly', async() => {
            const updated_name = 'Nguyen Van C'
            const updated_cmnd = '325323452'
            const updated_email = 'c@email.com'
            const updated_gender = true
            const updated_birth_date = birth_date
            updated_birth_date.setFullYear(birth_date.getFullYear() + 1)
            const updated_sign_update = sign_up_date
            updated_sign_update.setFullYear(sign_up_date.getFullYear() + 1)
            const updated_expiry_date = expiry_date
            updated_expiry_date.setFullYear(expiry_date.getFullYear() + 1)
            const response = await axios.put(`${process.env.API_URL}/users/${user_id_for_update_testcase}`, 
            {
                name: updated_name,
                cmnd: updated_cmnd,
                email: updated_email,
                gender: updated_gender,
                birthdate: updated_birth_date.toLocaleDateString(),
                signupdate: updated_sign_update.toLocaleDateString(),
                expirydate: updated_expiry_date.toLocaleDateString()
            })
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, message.State.SUCCESS)
            assert.strictEqual(response.data.Updated_user_id, user_id_for_update_testcase)

            const updated_result = await dbusers.get_user_by_id_async(user_id_for_update_testcase)
            const dbUser = updated_result.rows[0];
            assert.strictEqual(dbUser.name, updated_name);
            assert.strictEqual(dbUser.cmnd, updated_cmnd);
            assert.strictEqual(dbUser.gender, updated_gender);
            assert.strictEqual(dbUser.birthdate.toISOString(), updated_birth_date.toISOString());
            assert.strictEqual(dbUser.email, updated_email);
            assert.strictEqual(dbUser.signupdate.toISOString(), updated_sign_update.toISOString());
            assert.strictEqual(dbUser.expirydate.toISOString(), updated_expiry_date.toISOString());

        })

        it('8. should return status 500 and State will be error when called incorrectly', async() => {
            await axios.put(`${process.env.API_URL}/users/${user_id_for_update_testcase}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message)
            })
        })
        
        it('9. should return status 500 and State will be error when called with wrong id\'s value', async() => {
            await axios.put(`${process.env.API_URL}/users/${wrong_id}`, {}).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message_while_finding_an_entity('user'))
            })
        })
        
    })
    describe('delete user', async() => {
        it('9. should return status 200 and delete user when called successfully', async() => {
            const response = await axios.delete( `${process.env.API_URL}/users/${user_id_for_delete_testcase}`)
            const db_result = await dbusers.get_user_by_id_async(user_id_for_delete_testcase)
            assert.strictEqual(db_result.rowCount, 0)
            assert.strictEqual(response.status, 200)
            assert.strictEqual(response.data.State, message.State.SUCCESS)
            assert.strictEqual(response.data.Deleted_user_id, user_id_for_delete_testcase)
        })
        it('10. should return status 500 and State will be error when called with wrong id\'s format', async() => {
            const response = await axios.delete( `${process.env.API_URL}/users/1`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message)
            })
        })
        it('11.should return status 500 and State will be error when called with wrong id\'s value', async() => {
            const response = await axios.delete(`${process.env.API_URL}/users/${wrong_id}`).catch(error => {
                assert.strictEqual(error.response.status, 500)
                assert.strictEqual(error.response.data.State, message.State.ERROR)
                assert.strictEqual(error.response.data.Error_message, message.error_message)
            })
        })
    })

    after(async() => {
        await dbusers.delete_user_async(new_user_id)
        await dbusers.delete_user_async(user_id_for_update_testcase)
        await dbusers.delete_user_async(user_id_for_create_testcase)
    })
})
