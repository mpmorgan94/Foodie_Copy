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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import DeleteIcon from '@material-ui/icons/Delete';

export default class Profile extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            diet: "",
            allergies: [],
            restrictionList: ["Gluten Free", "Ketogenic", "Vegetarian", "Vegan", "Pescatarian", "Paleo", "Primal", "Whole30"]
        }
        console.log("in constructor: " + this.props.username)
    }
    componentDidMount()
    {
        //ask server handler for info for restrictions and allergies using this.props.username
        //update state to include user's info
        console.log("ran...");
    }
    

    toggleRestriction(res)
    {
        let copy = this.state.diet;
        if (copy === res)
        {
            this.setState({diet: ""}, () => console.log(this.state));
        }
        else
        {
            this.setState({diet: res}, () => console.log(this.state));
        }
    }
    addNewAllergy()
    {
        let copy = this.state.allergies;
        copy.push("");
        this.setState({allergies: copy}, ()=> console.log(this.state));
    }

    saveData()
    {
        console.log("save data button pressed. username: " + this.props.username);
    }

    updateAllergy(event, index)
    {
        let copy = this.state.allergies;
        copy[index] = event.target.value;
        this.setState({allergies: copy}, ()=> console.log(this.state));
    }
    deleteAllergy(index)
    {
        let copy = this.state.allergies;
        copy.splice(index,1);
        this.setState({allergies: copy}, () => console.log(this.state));
    }
    render()
    {
        return(
            <div>
                <h1>Profile</h1>
                <div>
                <List>
                    {this.state.restrictionList.map((res,index) => {
                        return (
                            <ListItem 
                            value = {res} 
                            key = {index}
                            >
                                <ListItemIcon
                                onClick = {() => this.toggleRestriction(res)}>
                                    <Checkbox
                                    checked = {this.state.diet === res}
                                    />
                                </ListItemIcon>
                                <ListItemText id = {index} primary = {res}/>
                            </ListItem>
                        );
                    })
                    }
                </List>
                </div>
                <div>
                <List>
                    {this.state.allergies.map((all,index) => {
                        return (
                        <div>
                            <TextField
                            value = {all}
                            key = {index}
                            label = "Allergy"
                            onChange = {(e) => this.updateAllergy(e,index)}/>
                            <DeleteIcon
                            onClick = {() => this.deleteAllergy(index)}/>
                        </div>
                        );
                    })
                }
                </List>
                </div>
                <Button onClick = {() => this.addNewAllergy()}>+ Allergy</Button>
                <Button onClick = {() => this.saveData()}>Save Data</Button>
            </div>
        );
    }
}
