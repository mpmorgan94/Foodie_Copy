import React from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Home from './Home';
import Profile from "./Profile";
import {useState} from 'react';

function App() {
  let [currentComponent, updateCurrentComponent] = useState("signup");
  let [username, updateUsername] = useState("");
  let [diet, updateDiet] = useState("");
  let [allergies, updateAllergies] = useState([]);
  Comp = () => {
    if(currentComponent === "signup")
    {
      return <SignUp 
          updateCurrentComponent = {updateCurrentComponent} 
          updateUsername = {updateUsername}>
          </SignUp>;
    }
    else if (currentComponent ===  "signin")
    {
      return <SignIn 
          updateCurrentComponent = {updateCurrentComponent} 
          updateUsername = {updateUsername}>
          </SignIn>;
    }
    else if (currentComponent === "home")
    {
      return <Home 
          updateCurrentComponent = {updateCurrentComponent} 
          username = {username} 
          diet = {diet} 
          allergies = {allergies}>
          </Home>;
    }
    else if (currentComponent === "profile")
    {
      return <Profile 
          pdateCurrentComponent = {updateCurrentComponent} 
          username = {username} updateDiet = {updateDiet} 
          updateAllergies = {updateAllergies}>
          </Profile>;
    }
  };

  return (
    <div className="App">
      <Comp/>
    </div>
  );


  
}

function Comp()
{
  
}

export default App;
