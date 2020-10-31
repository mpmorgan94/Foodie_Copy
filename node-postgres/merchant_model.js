const Pool = require('pg').Pool
const pool = new Pool({
  user: "postgres",
  host: "csce-315-proj3.czwkocow5s07.us-east-2.rds.amazonaws.com",
  database: "postgres",
  password: "o7NAWrjCdVk1rjMjicAB",
  port: 5432,
})

const getUsers = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM users', (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(results.rows);
    })
  }) 
}

const userExist = (body) => {
	return new Promise(function(resolve, reject) {
		const { username, password } = body
		pool.query('SELECT username FROM users WHERE username = $1', [username], (error, results) => {
			if (error) {
				reject(error)
			}
			if (results.rows[0] == null){
				resolve(false)
			}
			else if (results.rows[0].username.trim() === username) {
				resolve(true)
			}
			else {
				resolve(false)
			}
		})
	})
}

const verifyCreds = (body) => {
	return new Promise(function(resolve, reject) {
		const { username, passwordHash } = body
		pool.query('SELECT username FROM users WHERE username = $1 AND password = $2', [username, passwordHash], (error, results) => {
			if (error) {
				reject(error)
			}
			if (results.rows[0] == null){
				resolve(false)
			}
			else if (results.rows[0].username.trim() === username) {
				resolve(true)
			}
			else {
				resolve(false)
			}
		})
	})
}

const createUser = (body) => {
  return new Promise(function(resolve, reject) {
    const { username, passwordHash } = body
    console.log("creating user...")
    var preformInsert = false;

    pool.query('SELECT username FROM users WHERE username = $1', [username], (error, results) => {
		if (error) {
			console.log(error);
		}
		if (results.rows[0] == null){
			console.log("user not found (null)");
			pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, passwordHash], (error, results) => {
                if (error) {
                    reject(error)
                }
            })
		}
		else if (results.rows[0].username.trim() === username) {
			console.log("user found");
		}
		else {
			console.log("user not found");
			pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, passwordHash], (error, results) => {
                if (error) {
                    reject(error)
                }
            })
		}
	})
    
  })
}

const deleteMerchant = () => {
  return new Promise(function(resolve, reject) {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM users WHERE username = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      //resolve(true)
      //resolve(`Merchant deleted with ID: ${id}`)
    })
  })
}

module.exports = {
  getUsers,
  userExist,
  verifyCreds,
  createUser,
  deleteMerchant,
}