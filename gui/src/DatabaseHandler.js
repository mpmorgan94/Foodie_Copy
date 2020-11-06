import { Unstable_TrapFocus } from "@material-ui/core";
import { Schedule } from "@material-ui/icons";
import PasswordHasher from './PasswordHasher.js';

function DatabaseHandler(functionName, username, password, diet, allergy_array, recipe_id, schedule_string) {

  var userExistBool = true;
  var recipeExistBool = true;
  var credsVerified = false;

  function getUsers() {
    fetch('http://localhost:3001/')
      .then(response => {
        return response.text();
      })
  }

  async function userExist(username) {
    await fetch(`http://localhost:3001/userExist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {

        //alert(data);
        if (data === 'false') {
          userExistBool = false;
        }
        else {
          userExistBool = true;
        }
        //debugging
        console.log("userExistBool from userExist Function = " + userExistBool);
      });

      return userExistBool;
  }

  async function verifyCreds(username, password) {

    // change password to hash
    let ph = new PasswordHasher();
    let passwordHash = ph.hashPassword(password);

    await fetch(`http://localhost:3001/verifyCreds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, passwordHash}),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {

        //alert(data);
        if (data === 'false') {
          credsVerified = false;
        }
        else {
          credsVerified = true;
        }
        //debugging
        console.log("credsVerified from verifyCreds Function = " + credsVerified);
      });

      return credsVerified;
  }

  async function createUser(username, password) {

    // change password to hash
    let ph = new PasswordHasher();
    let passwordHash = ph.hashPassword(password);

    // debugging
    console.log("userExistBool before = " + userExistBool)
    await userExist(username)
    console.log("userExistBool after = " + userExistBool)

    // Here we check if user already exist
    // If so, we do not create a new user
    if (userExistBool) {
      // do not create new user
      // set userexist bool back to true (default)
      userExistBool = true
      console.log("the user already exist. Can not create new user.")
      return false;
    }
    else {
      // create a new user
      // set userexist bool back to true (default)
      userExistBool = true
      console.log("creating new user...")
      await fetch('http://localhost:3001/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, passwordHash}),
      })
      .then(response => {
      });
    }

    return true;
  }

  async function createRecipe(username, recipe_id) {
    await recipeExist(username,recipe_id)

    if (recipeExistBool) {
      recipeExistBool = true
      console.log("This recipe already exists for this user!")
      return false;
    }
    else {
      recipeExistBool = true

      await fetch('http://localhost:3001/createRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, recipe_id}),
      })
      .then(response => {
      });

    }

    return true;
  }

  async function deleteRecipe(username, recipe_id) {
    await recipeExist(username, recipe_id)

    if (recipeExistBool) {
      recipeExistBool = true

      await fetch('http://localhost:3001/deleteRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, recipe_id}),
      })
      .then(response => {
      });

    }
    else {
      recipeExistBool = true
      console.log("This user recipe does not exist!")
      return false;
    }
    return true;
  }

  async function recipeExist(username, recipe_id) {
      await fetch(`http://localhost:3001/recipeExist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, recipe_id}),
      })
      .then(response => {
        return response.text();
      })
      .then(data => {

        //alert(data);
        if (data === 'false') {
          recipeExistBool = false;
        }
        else {
          recipeExistBool = true;
        }
        //debugging
        console.log("recipeExistBool from recipeExist Function = " + recipeExistBool);
      });
  }

  async function saveDiet(username, diet) {

    // save the diet
    console.log("saving diet...")
    await fetch('http://localhost:3001/saveDiet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, diet}),
    })
    .then(response => {
      return response.text()
    });

    return true;
  }

  async function getUserDiet(username) {
    var this_diet = "null"

    await fetch('http://localhost:3001/getUserDiet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username}),
    })
    .then(response => {
      return response.text()
    })
    .then(data => {
      this_diet = data
    });

    return this_diet;
  }

  function saveAllergies(username, allergy_array) {
    console.log(username)
    console.log(allergy_array)
    fetch('http://localhost:3001/saveAllergies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, allergy_array}),
    })
    .then(response => {
      return response.text()
    });

    return true;
  }

  async function getAllergies(username) {
    var allergy_array = []
    var allergy_array_string = ""

    await fetch('http://localhost:3001/getAllergies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username}),
    })
    .then(response => {
      return response.text()
    })
    .then(data => {
      allergy_array_string = data
    });
    console.log(allergy_array_string)
    allergy_array = allergy_array_string.split('*')
    allergy_array.pop()
    return allergy_array;
  }

  function deleteMerchant() {
    let id = prompt('Enter merchant id');
    fetch(`http://localhost:3001/merchants/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        alert(data);
        getUsers();
      });
  }

  function saveSchedule(username, schedule_string) {
    fetch('http://localhost:3001/saveSchedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, schedule_string}),
    })
    .then(response => {
      return response.text()
    });

    return true;
  }

  async function getSchedule(username) {
    var schedule_array = []
    var schedule_array_string = ""

    await fetch('http://localhost:3001/getSchedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username}),
    })
    .then(response => {
      return response.text()
    })
    .then(data => {
      schedule_array_string = data
    });
    console.log(schedule_array_string)
    schedule_array = schedule_array_string.split(',')
    console.log(schedule_array)
    //allergy_array.pop()
    return schedule_array;
  }

  if (functionName === "createUser") {
    return createUser(username, password);
  }
  else if (functionName === "userExist") {
    return userExist(username);
  }
  else if (functionName === "deleteUser") {
    // this does not work yet
    return deleteMerchant();
  }
  else if (functionName === "verifyCreds") {
    return verifyCreds(username, password);
  }
  else if (functionName === "saveDiet") {
    return saveDiet(username, diet);
  }
  else if (functionName === "getUserDiet") {
    return getUserDiet(username);
  }
  else if(functionName === "saveAllergies") {
    return saveAllergies(username, allergy_array);
  }
  else if(functionName === "recipeExist"){
    return recipeExist(username, recipe_id);
  }
  else if(functionName === "createRecipe"){
    return createRecipe(username, recipe_id);
  }
  else if(functionName === "deleteRecipe"){
    return deleteRecipe(username, recipe_id);
  }
  else if(functionName === "getAllergies"){
    return getAllergies(username);
  }
  else if(functionName === "saveSchedule"){
    return saveSchedule(username, schedule_string);
  }
  else if(functionName === "getSchedule"){
    return getSchedule(username);
  }


}

export default DatabaseHandler;
