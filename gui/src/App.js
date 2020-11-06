import React from 'react';
import {useState} from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Home from './Home';
import Profile from "./Profile";
import Scheduler from './Scheduler';
import Favorites from './Favorites';

function App() {
  let [currentComponent, updateCurrentComponent] = useState("signup");
  let [username, updateUsername] = useState("");
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
          username = {username} >
          </Home>;
    }
    else if (currentComponent === "profile")
    {
      return <Profile 
          updateCurrentComponent = {updateCurrentComponent} 
          username = {username} >
          </Profile>;
    }
    else if (currentComponent === "scheduler")
    {
      return <Scheduler
            updateCurrentComponent = {updateCurrentComponent} 
            username = {username}>
            </Scheduler>;
    }
    else if (currentComponent === "favorites")
    {
      return <Favorites 
            updateCurrentComponent = {updateCurrentComponent}
            username = {username}>

            </Favorites>
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
