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

export default class SignUp extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            username: "",
            password: "",
            wrong: false
        }
        
    }

    async validate()
    {
        //console.log(this.state.username);
        
        // user not created by default
        // dh (Database Handler) will return true if user was created and false if user was not created
        let dh = false;

        console.log(await new DatabaseHandler("userExist", this.state.username, "null"));
        if (await new DatabaseHandler("userExist", this.state.username, "null") === false) {
            dh = await new DatabaseHandler("createUser", this.state.username, this.state.password);
            console.log("createUser called. Function returned: " + dh);
        }
        else {
            console.log("User already existed");
        }

        // set state
        if (dh) {
            this.setState({wrong: false});
        }
        else {
            this.setState({wrong: true});
        }

        // go somewhere???

    }

    handleUsernameChange = event =>{
        this.setState({ username: event.target.value });
    }
    handlePasswordChange = event =>{
        this.setState({ password: event.target.value });
    }

    goToSignIn()
    {
        this.props.updateCurrentComponent("signin");
    }

    render()
    {
        return(
            <div>
                <Container component="main" maxWidth="xs">
                    <div>
                        <Avatar></Avatar>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
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
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            id="password"
                            autoFocus
                            error = {this.state.wrong}
                            value = {this.state.password}
                            onChange = {this.handlePasswordChange.bind(this)}/>
                        <Button 
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick = {this.validate.bind(this)}>
                            Sign Up
                        </Button>
                        <h5>Returning User?</h5>
                        <Button
                            fullWidth
                            variant = "contained"
                            color = "primary"
                            onClick = {this.goToSignIn.bind(this)}>
                            Sign In
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }
}
