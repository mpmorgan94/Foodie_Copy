import { Unstable_TrapFocus } from "@material-ui/core";
import PasswordHasher from './PasswordHasher.js';

function DatabaseHandler(functionName, username, password) {
  
  var userExistBool = true;
  var credsVerified = false;

  function getUsers() {
    fetch('http://18.218.252.219:3001/')
      .then(response => {
        return response.text();
      })
  }

  async function userExist(username) {
    //let username = prompt('Enter user id');
    //let username = username;
    await fetch(`http://18.218.252.219:3001/userExist`, {
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

    await fetch(`http://18.218.252.219:3001/verifyCreds`, {
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

  // currently does not hash password and does not check for already existing user
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
      await fetch('http://18.218.252.219:3001/createUser', {
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

  function deleteMerchant() {
    let id = prompt('Enter merchant id');
    fetch(`http://18.218.252.219:3001/merchants/${id}`, {
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


}

export default DatabaseHandler;