import { Unstable_TrapFocus } from "@material-ui/core";
import { Schedule } from "@material-ui/icons";
import PasswordHasher from './PasswordHasher.js';

function DatabaseHandler(functionName, username, password, diet, allergy_array, recipe_id_string , schedule_string, weight, feet, inches, age, sex) {


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

  async function saveRecipes(username, recipe_id_string) {

    console.log("saving recipe...")
    await fetch('http://localhost:3001/saveRecipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, recipe_id_string}),
    })
    .then(response => {
    });

    return true;
  }

  async function getRecipes(username) {
    var recipe_id_string = "null"

    await fetch('http://localhost:3001/getRecipes', {
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
      recipe_id_string = data
    });

    return recipe_id_string;

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

  async function saveBMI(username, weight, feet, inches, age, sex) {
    // save the bmi info
    console.log("saving bmi info")
    console.log(username + " " + weight + " " + feet + " " + inches + " " + age + " " + sex)

    await fetch('http://localhost:3001/saveBMI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, weight, feet, inches, age, sex}),
    })
    .then(response => {
      return response.text()
    });

    return true;
  }

  async function getWeight(username) {
    var this_weight = "null"

    await fetch('http://localhost:3001/getWeight', {
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
      this_weight = data
    });

    return this_weight;
  }

  async function getFeet(username) {
    var this_feet = "null"

    await fetch('http://localhost:3001/getFeet', {
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
      this_feet = data
    });

    return this_feet;
  }

  async function getInches(username) {
    var this_inches = "null"

    await fetch('http://localhost:3001/getInches', {
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
      this_inches = data
    });

    return this_inches;
  }

  async function getAge(username) {
    var this_age = "null"

    await fetch('http://localhost:3001/getAge', {
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
      this_age = data
    });

    return this_age;
  }

  async function getSex(username) {
    var this_sex = "null"

    await fetch('http://localhost:3001/getSex', {
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
      this_sex = data
    });

    return this_sex;
  }


  if (functionName === "createUser") {
    return createUser(username, password);
  }
  else if (functionName === "userExist") {
    return userExist(username);
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
  else if(functionName === "getAllergies"){
    return getAllergies(username);
  }
  else if(functionName === "saveSchedule"){
    return saveSchedule(username, schedule_string);
  }
  else if(functionName === "getSchedule"){
    return getSchedule(username);
  }
  else if(functionName === "saveRecipes"){
    return saveRecipes(username, recipe_id_string);
  }
  else if (functionName === "getRecipes"){
    return getRecipes(username);
  }
  else if (functionName === "saveBMI"){
    return saveBMI(username, weight, feet, inches, age, sex);
  }
  else if (functionName === "getWeight"){
    return getWeight(username);
  }
  else if (functionName === "getFeet"){
    return getFeet(username);
  }
  else if (functionName === "getInches"){
    return getInches(username);
  }
  else if (functionName === "getAge"){
    return getAge(username);
  }
  else if (functionName === "getSex"){
    return getSex(username);
  }


}

export default DatabaseHandler;
