const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'LMS',
  password: '123456789',
  port: 5432,
})


function getUsers() {
    pool.query('SELECT * FROM public.users', (error, results) => {
        if(error) {
            throw error;
        }
        for (let user of results.rows){
            console.log(user);
        }
    })
}

getUsers();