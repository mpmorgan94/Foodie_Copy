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
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import DatabaseHandler from './DatabaseHandler.js';

export default class Profile extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            diet: "",
            allergies: [],
            restrictionList: ["Gluten Free", "Ketogenic", "Vegetarian", "Vegan", "Pescatarian", "Paleo", "Primal", "Whole30"],
            feet: "1",
            inches: "",
            weight: "",
            age: "",
            sex: "m",
            calIntake: 0,
            weightError: false,
            inchError: false,
            ageError: false,
            bmi: {},
            idealWeight: "",
            bmiCalculated: false
        }
        console.log(this.props.username);
    }
    componentDidMount()
    {
        //ask server handler for info for restrictions and allergies using this.props.username
        //update state to include user's info
        this.retreiveData();

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

    updateWeight(event)
    {
        if(isNaN(event.target.value))
        {
            this.setState({weightError: true},() => console.log(this.state));
        }
        else
        {
            this.setState({weight: event.target.value, weightError: false}, () => console.log(this.state));
        }
    }

    updateFeet(event)
    {
        this.setState({feet: event.target.value}, () => console.log(this.state));
    }

    updateInches(event)
    {
        if(isNaN(event.target.value))
        {
            this.setState({inchError: true},() => console.log(this.state));
        }
        else if (Number(event.target.value) >= 12.0 || Number(event.target.value)< 0.0)
        {
            this.setState({inchError: true},() => console.log(this.state));
        }
        else
        {
            this.setState({inches: event.target.value, inchError: false}, () => console.log(this.state));
        }
    }

    updateAge(event)
    {
        if(isNaN(event.target.value))
        {
            this.setState({ageError: true},() => console.log(this.state));
        }
        else
        {
            this.setState({age: event.target.value, ageError: false}, () => console.log(this.state));
        }
    }

    updateSex(event)
    {
        this.setState({sex: event.target.value}, () => console.log(this.state));
    }

    calculateBMI()
    {
        var heightString = this.state.feet.concat("-",this.state.inches);
        console.log(heightString);
        var params = JSON.stringify(
            {
                "weight":
                {
                    "value": this.state.weight,
                    "unit": "lb"
                },
                "height":
                {
                    "value": heightString,
                    "unit": "ft-in"
                },
                "age": this.state.age,
                "sex": this.state.sex

            }
        );

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        /*xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                console.log(this.responseText);
            }
        });*/

        xhr.open("POST", "https://rapidapi.p.rapidapi.com/");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("x-rapidapi-key", "98419d9ab3msh3e8c10a2a9f298bp15e0e8jsn0d572e2a6994");
        xhr.setRequestHeader("x-rapidapi-host", "bmi.p.rapidapi.com");

        xhr.send(params);

        xhr.onload = () => {
            var data = JSON.parse(xhr.response);
            if(xhr.status >= 200 && xhr.status < 400)
            {

                var ideal = data.ideal_weight;
                var databmi = data.bmi;
                this.setState({idealWeight: ideal, bmi: databmi, bmiCalculated: true}, ()=> console.log(this.state));
            }
        }

    }

    async retreiveData()
    {
        //get the diet, array of allergies, feet for height, inches for height, weight, age, and sex
        // store them in the state with the call this.setState({diet: serverdiet, allergies: serverallergies, feet: serverfeet, inches: serverinches, age: serverage, sex: serversex}, ()=>console.log(this.state))
        //the console.log will show you the current state in inspect. use that to ensure the data is being loaded correctly.
        //this will be called at the beginning of componentDidMount in final version but can be called using the corresponding button

        //Set initial diet
        let dh = "null";
        dh = await new DatabaseHandler("getUserDiet", this.props.username);
        if (dh != "null")
        {
            this.setState({diet: dh});
        }

        //Set initial Allergies
        dh = [];
        dh = await new DatabaseHandler("getAllergies", this.props.username);
        if (dh.length != 0 && dh[0] != "null")
        {
            this.setState({allergies: dh});
        }

        //weight
        dh = "null";
        dh = await new DatabaseHandler("getWeight", this.props.username);
        if ((dh != "null") && (dh != "[object Object]") && dh != "0")
        {
            console.log(dh);
            this.setState({weight: dh});
            console.log(this.state.weight);
        }

        //feet
        dh = "null";
        dh = await new DatabaseHandler("getFeet", this.props.username);
        if ((dh !== "null") && (dh !== "[object Object]"))
        {
            console.log(dh);
            this.setState({feet: dh});
            console.log(this.state.feet);
        }

        //inches
        dh = "null";
        dh = await new DatabaseHandler("getInches", this.props.username);
        if ((dh != "null") && (dh != "[object Object]"))
        {
            console.log(dh);
            this.setState({inches: dh});
            console.log(this.state.inches);
        }

        //age
        dh = "null";
        dh = await new DatabaseHandler("getAge", this.props.username);
        if ((dh != "null") && (dh != "[object Object]"))
        {
            console.log(dh);
            this.setState({age: dh});
            console.log(this.state.age);
        }

        //sex
        dh = "null";
        dh = await new DatabaseHandler("getSex", this.props.username);
        if ((dh != "null") && (dh != "[object Object]"))
        {
            console.log(dh);
            this.setState({sex: dh});
            console.log(this.state.sex);
        }

        console.log(this.state);



        //Set inital BMI data
    }

    async storeData()
    {
        //store the state into the server; store the diet, array of allergies, feet for height, inches for height, weight, age, and sex
        // to get the array call this.state.allergies, this.state.diet, etc.
        //the array should show up using pgadmin or whatever you use to see the database
        //this will be called when clicking on the nav bar in the final version but can be called using the corresponding button
        //before storing the profile data, make sure to delete the old profile data corresponding to the username

        //Send diet
        let dh = false;
        dh = await new DatabaseHandler("saveDiet", this.props.username, "null", this.state.diet);

        //Send allergies
        dh = false;
        dh = await new DatabaseHandler("saveAllergies", this.props.username, "null", "null", this.state.allergies);

        //send bmi
        dh = false;
        console.log("The weight is: " + this.state.weight + " " + this.state.feet + " " + this.state.inches + " " + this.state.age + " " + this.state.sex);
        dh = await new DatabaseHandler("saveBMI", this.props.username, "null", "null", "null", "null", "null", this.state.weight, this.state.feet, this.state.inches, this.state.age, this.state.sex);
    }

    async goToPage(page)
    {
        //save state to server here
        await this.storeData();
        this.props.updateCurrentComponent(page);
    }


    useStyles = {
        bar: {
            backgroundColor: "#0f0997"
        },
        buttons: {
            
            backgroundColor: "#0f0997",
            color: "#fcfcff",
            width: "140px",
            borderRadius: "5px",
            marginTop: "5px",
            marginBottom: "10px",
            
        },
        dietaryGrid: {
            marginLeft: "30px",
        },
        bmiGrid: {
            marginTop: "18px",
            marginLeft: "60px"
        },
        bmiInfo: {
            marginBottom: "5px",
        },
        bmiTitles: {
            fontSize: "25px",
            fontWeight: "bold",
            fontFamily: "Helvetica Neue",
        },
        bmiResult: {
            fontSize: "23px"
        }

    };

    render()
    {
        var classes = this.useStyles;
        return(
            <div>
                <AppBar position="static" style ={classes.bar}>
                    <Toolbar>
                    <Button style = {classes.butons} color = "inherit" onClick = {()=>this.goToPage("home")}>Home</Button>
                    <Typography style = {{marginLeft: "5px", marginRight: "7px"}} variant="h6">
                        Profile
                    </Typography>
                    <Button style = {classes.butons} color = "inherit" onClick = {()=>this.goToPage("favorites")}>Favorites</Button>
                    <Button style = {classes.butons} color = "inherit" onClick = {()=>this.goToPage("scheduler")}>Scheduler</Button>
                    <Grid style = {{width: "90%"}} container justify="flex-end"><Button color = "inherit" onClick = {()=>this.goToPage("signin")}>Sign Out</Button></Grid>
                    </Toolbar>
                </AppBar>
                <div>
                    <Grid container style = {classes.grid}>
                        <Box style = {classes.dietaryGrid}>
                            <div>
                                <List>
                                    <ListItem>
                                        <h2>Dietary Restriction (Optional)</h2>
                                    </ListItem>
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
                                    <ListItem>
                                        <h3>Allergies</h3>
                                    </ListItem>
                                    {this.state.allergies.map((all,index) => {
                                        return (
                                        <div>
                                            <TextField
                                            value = {all}
                                            key = {index}
                                            label = "Allergy"
                                            onChange = {(e) => this.updateAllergy(e,index)}/>
                                            <DeleteIcon
                                            style ={{marginTop: "20px"}}
                                            onClick = {() => this.deleteAllergy(index)}/>
                                        </div>
                                        );
                                    })
                                }
                                </List>
                            </div>
                            <Button style = {classes.buttons} onClick = {() => this.addNewAllergy()}>+ Allergy</Button>
                        </Box>
                        <Box style = {classes.bmiGrid}>
                            <div>
                                <h2>BMI Calculator</h2>
                            </div>
                            <div>
                            <TextField
                                value = {this.state.weight}
                                label = "Weight (in lbs)"
                                error = {this.state.weightError}
                                onChange = {(e) => this.updateWeight(e)}/>
                            </div>
                            <h6>Height</h6>
                            <div>
                                <TextField
                                value = {this.state.feet}
                                label="Feet"
                                select
                                onChange = {(e) => this.updateFeet(e)}
                                style = {{width: "60px", marginRight: "5px"}}>
                                    <MenuItem value="1">1</MenuItem>
                                    <MenuItem value="2">2</MenuItem>
                                    <MenuItem value="3">3</MenuItem>
                                    <MenuItem value="4">4</MenuItem>
                                    <MenuItem value="5">5</MenuItem>
                                    <MenuItem value="6">6</MenuItem>
                                    <MenuItem value="7">7</MenuItem>
                                </TextField>
                                <TextField
                                    label = "Inches"
                                    error = {this.state.inchError}
                                    onChange = {(e) => this.updateInches(e)}/>
                            </div>
                            <div>
                            <TextField
                                value = {this.state.age}
                                label = "Age"
                                error = {this.state.ageError}
                                onChange = {(e) => this.updateAge(e)}/>
                            </div>
                            <div>
                                <TextField
                                label="Sex"
                                select
                                value = {this.state.sex}
                                onChange = {(e) => this.updateSex(e)}
                                style = {{width: "90px", marginBottom: "15px"}}>
                                    <MenuItem value="m">Male</MenuItem>
                                    <MenuItem value="f">Female</MenuItem>
                                </TextField>
                            </div>
                            <div>
                                <Button style ={classes.buttons} onClick = {() => this.calculateBMI()}>Calculate BMI</Button>
                            </div>
                            {this.state.bmiCalculated ?
                                <div>
                                    <div style = {classes.bmiInfo}>
                                        <spam style = {classes.bmiTitles}>BMI: </spam><spam style = {classes.bmiResult}>{this.state.bmi.value}</spam>
                                    </div>
                                    <div style = {classes.bmiInfo}>
                                        <spam style = {classes.bmiTitles}>Status: </spam><spam style = {classes.bmiResult}>{this.state.bmi.status}</spam>
                                    </div>
                                    <div style = {classes.bmiInfo}>
                                        <spam style = {classes.bmiTitles}>Risks: </spam><spam style = {classes.bmiResult}>{this.state.bmi.risk}</spam>
                                    </div>
                                    <div style = {classes.bmiInfo}>
                                        <spam style = {classes.bmiTitles}>Ideal Weight: </spam><spam style = {classes.bmiResult}>{this.state.idealWeight}</spam>
                                    </div>
                                </div> :
                                <div></div>}
                        </Box>
                    </Grid>
                </div>
            </div>
            
        );
    }
}
