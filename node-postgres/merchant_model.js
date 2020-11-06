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

const recipeExist = (body) => {
  return new Promise(function(resolve, reject) {
    const {username, recipe_id} = body
    pool.query('SELECT username FROM recipes WHERE username = $1 AND recipe_id = $2', [username, recipe_id], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows[0] == null){
				resolve(false)
			}
			else if (results.rows[0].username.trim() === users) {
				resolve(true)
			}
      else {
        resolve(false)
      }
    })
  })
}

const createRecipe = (body) => {
  return new Promise(function(resolve, reject) {
    const { username, recipe_id } = body
    console.log("Creating new recipe...")
    pool.query('SELECT username FROM recipes WHERE users = $1 AND recipe_id = $2', [username, recipe_id], (error, results) => {
      if (error){
        reject(error)
      }
      if (results.rows[0] == null){
        pool.query('INSERT INTO recipes (username, recipe_id) VALUES ($1, $2) RETURNING *', [username, recipe_id], (error, results) => {
            if (error) {
              reject(error)
            }
        })
      }

      else if ((results.rows[0].usernamme.trim() === username) && (results.rows[0].recipe_id.trim() === recipe_id)) {
        console.log("This recipe already exists!")
      }
      else {
        pool.query('INSERT INTO recipes (username, recipe_id) VALUES ($1, $2) RETURNING *', [username, recipe_id], (error, results) => {
          if (error) {
            reject(error)
          }
        })
      }
    })
  })
}

const deleteRecipe = (body) => {
  return new Promise(function(resolve, reject) {
    const {username, recipe_id} = body
    pool.query('SELECT username FROM recipes WHERE username = $1 AND recipe_id = $2', [username, recipe_id], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows[0] == null){
        console.log("This recipe already does not exist. Can not delete.")
      }
      else {
        pool.query('DELETE FROM recipes WHERE username = $1 and recipe_id = $2', [username, recipe_id], (error, results) => {
          if (error) {
            reject(error)
          }
        })
      }

    })

  })
}

//Assuming user always exist
const saveDiet = (body) => {
  return new Promise(function(resolve, reject) {
    const { username, diet } = body
    console.log("saving diet...")

    pool.query('UPDATE users SET diet = $1 WHERE username = $2', [diet, username], (error, results) => {
      if (error) {
        console.log(error)
        reject(error)
      }
      console.log("diet saved.")
      resolve(true)
    })

  })
}

const getUserDiet = (body) => {
  return new Promise(function(resolve, reject) {
    const { username } = body
    pool.query('SELECT diet FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows.length == 0) {
        resolve("null")
      }
      else if (results.rows[0].diet != null) {
        resolve(results.rows[0].diet.trim());
      }
      else {
        resolve("null")
      }
    })
  })
}

// Assuming user always exist
const saveAllergies = (body) => {
  return new Promise(function(resolve, reject) {

    const { username, allergy_array } = body

    //delete all current allergies
    pool.query('DELETE FROM allergies WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(true)
    })


    // Insert all the new allergies
    var i;
    for (i = 0; i < allergy_array.length; i++) {
      pool.query('INSERT INTO allergies (username, allergy) VALUES ($1, $2)', [username, allergy_array[i]], (error, results) => {
        if (error) {
          reject(error)
        }
        else {
          console.log("an allergy saved.")
          resolve(true)
        }
      })
    }

  })
}

// Assuming user always exist
const getAllergies = (body) => {
  return new Promise(function(resolve, reject) {
    const { username } = body
    var allergy_array_string = ""
    pool.query('SELECT allergy FROM allergies WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows.length == 0) {
        resolve("null")
      }
      else if (results.rows[0].allergy != null) {
        var i = 0
        for (i = 0; i < results.rows.length; i++) {
          allergy_array_string = allergy_array_string + results.rows[i].allergy.trim() + "*"
        }
        resolve(allergy_array_string);
      }
      else {
        resolve("null")
      }
    })
  })
}

// Assuming user always exist
const saveSchedule = (body) => {
  return new Promise(function(resolve, reject) {

    const { username, schedule_string } = body

    //Assuming user always exist
    pool.query('UPDATE users SET schedule = $1 WHERE username = $2', [schedule_string, username], (error, results) => {
      if (error) {
        console.log(error)
        reject(error)
      }
      console.log("schedule saved.")
      resolve(true)
    })
  })
}

// Assuming user always exist
const getSchedule = (body) => {
  return new Promise(function(resolve, reject) {
    const { username } = body
    var schedule_array_string = ""
    pool.query('SELECT schedule FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows.length == 0) {
        resolve("null")
      }
      else if (results.rows[0].schedule != null) {
        resolve(results.rows[0].schedule.trim());
      }
      else {
        resolve("null")
      }
    })
  })
}

module.exports = {
  getUsers,
  userExist,
  verifyCreds,
  createUser,
  deleteMerchant,
  recipeExist,
  createRecipe,
  deleteRecipe,
  saveDiet,
  getUserDiet,
  saveAllergies,
  getAllergies,
  saveSchedule,
  getSchedule
}
