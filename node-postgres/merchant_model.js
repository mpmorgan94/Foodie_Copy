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

// Assuming user always exist
const saveRecipes = (body) => {
  return new Promise(function(resolve, reject) {
    const { username, recipe_id_string } = body

    pool.query('UPDATE users SET recipes = $1 WHERE username = $2', [recipe_id_string, username], (error, results) => {
      if (error) {
        console.log(error)
        reject(error)
      }
      console.log("recipes saved.")
      resolve(true)
    })
  })
}

const getRecipes = (body) => {
  return new Promise(function(resolve, reject) {
    const { username } = body
    pool.query('SELECT recipes FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows.length == 0) {
        resolve("null")
      }
      else if (results.rows[0].recipes != null) {
        resolve(results.rows[0].recipes.trim());
      }
      else {
        resolve("null")
      }

    })
  })
}

const saveBMI = (body) => {
  return new Promise(function(resolve, reject) {
    const { username, weight, feet, inches, age, sex } = body
    console.log("saving bmi...")
    console.log("This is the username" + username)

     pool.query('UPDATE users SET weight = $1 , feet = $2 , inches = $3 , age = $4 , sex = $5 WHERE username = $6', [weight, feet, inches, age, sex, username], (error, results) => {
      if (error) {
        console.log(error)
        reject(error)
      }
      console.log("bmi saved.")
      resolve(true)
    })

  })
}

const getWeight = (body) => {
  return new Promise(function(resolve, reject) {
    const { username } = body
    pool.query('SELECT weight FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows.length == 0) {
        resolve("null")
      }
      else if (results.rows[0].weight != null) {
        resolve(results.rows[0].weight.trim());
      }
      else {
        resolve("null")
      }

    })
  })
}

const getFeet = (body) => {
  return new Promise(function(resolve, reject) {
    const { username } = body
    pool.query('SELECT feet FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows.length == 0) {
        resolve("null")
      }
      else if (results.rows[0].feet != null) {
        resolve(results.rows[0].feet.trim());
      }
      else {
        resolve("null")
      }

    })
  })
}

const getInches = (body) => {
  return new Promise(function(resolve, reject) {
    const { username } = body
    pool.query('SELECT inches FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows.length == 0) {
        resolve("null")
      }
      else if (results.rows[0].inches != null) {
        resolve(results.rows[0].inches.trim());
      }
      else {
        resolve("null")
      }

    })
  })
}

const getAge = (body) => {
  return new Promise(function(resolve, reject) {
    const { username } = body
    pool.query('SELECT age FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows.length == 0) {
        resolve("null")
      }
      else if (results.rows[0].age != null) {
        resolve(results.rows[0].age.trim());
      }
      else {
        resolve("null")
      }

    })
  })
}

const getSex = (body) => {
  return new Promise(function(resolve, reject) {
    const { username } = body
    pool.query('SELECT sex FROM users WHERE username = $1', [username], (error, results) => {
      if (error) {
        reject(error)
      }
      if (results.rows.length == 0) {
        resolve("null")
      }
      else if (results.rows[0].sex != null) {
        resolve(results.rows[0].sex.trim());
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
  saveDiet,
  getUserDiet,
  saveAllergies,
  getAllergies,
  saveSchedule,
  getSchedule,
  saveRecipes,
  getRecipes,
  saveBMI,
  getWeight,
  getFeet,
  getInches,
  getAge,
  getSex,
}
