const Pool = require('pg').Pool

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})


module.exports = {
    query: (text, params, callback) => {
      if(params){
        return pool.query(text, params, (err, res) => {
          callback(err, res)
        })
      }
      return pool.query(text, (err, res) => {
        callback(err, res)
      })
    },
    async query_async(text, params) {
      if(params){
        return await pool.query(text, params) 
      }
      return await pool.query(text)
    }
  }
