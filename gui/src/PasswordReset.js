import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


import DatabaseHandler from './DatabaseHandler.js';

export default class PasswordReset extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = 
        {
            username: "",
            answer1:"",
            answer2:"",
            answer3:"",
            newpassword: "",
            wrong: false,
            enableNewPassword: false
        }
        
    }

    validate()
    {
        //check if security questions answered correctly
        this.setState({wrong: false, enableNewPassword: true});
    }


    handleUsernameChange = event =>{
        this.setState({ username: event.target.value });
    }

    handlePasswordChange = event =>{
        this.setState({ newpassword: event.target.value });
    }

    handleQuestion1Change = event =>{
        this.setState({answer1: event.target.value})
    }

    handleQuestion2Change = event =>{
        this.setState({answer2: event.target.value})
    }

    handleQuestion3Change = event =>{
        this.setState({answer3: event.target.value})
    }

    createNewPassword()
    {
        //store new password on server side
        this.props.updateCurrentComponent("signin");
    }

    goToSignUp()
    {
        this.props.updateCurrentComponent("signup");
    }



    render()
    {
        return(
            <div>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                error = {this.state.wrong}
                value = {this.state.username}
                onChange = {this.handleUsernameChange.bind(this)}
                />
                <Typography> What is the color of your car?</Typography>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="question 1"
                label="Security Question 1"
                id="question1"
                autoFocus
                value = {this.state.answer1}
                error = {this.state.wrong}
                onChange = {this.handleQuestion1Change.bind(this)}/>
                <Typography> What city were you born in?</Typography>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="question 2"
                label="Security Question 2"
                id="question2"
                autoFocus
                error = {this.state.wrong}
                value = {this.state.answer2}
                onChange = {this.handleQuestion2Change.bind(this)}/>
                <Typography> What is your favorite food?</Typography>
                <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="question 3"
                label="Security Question 3"
                id="question3"
                autoFocus
                error = {this.state.wrong}
                value = {this.state.answer3}
                onChange = {this.handleQuestion3Change.bind(this)}/>
                <Button onClick = {()=>this.validate()}>Answer Questions</Button>
                <div>
                    {this.state.enableNewPassword ? 
                        <div>
                            <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            id="password"
                            autoFocus
                            value = {this.state.newpassword}
                            onChange = {this.handlePasswordChange.bind(this)}/>
                            <Button onClick = {()=>this.createNewPassword()}>Create New Password</Button>
                        </div> : <div></div>}
                </div>
                <Button onClick = {()=>this.goToSignUp()}>Create New Account</Button>
            </div>
        );
    }
}
