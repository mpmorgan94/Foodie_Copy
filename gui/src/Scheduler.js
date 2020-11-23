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
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CloseIcon from '@material-ui/icons/Close';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import DatabaseHandler from './DatabaseHandler.js';

export default class Scheduler extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            basket: [],
            monday: {
                breakfast: "Breakfast",
                snack: "Snack",
                lunch: "Lunch",
                dinner: "Dinner",
            },
            tuesday: {
                breakfast: "Breakfast",
                snack: "Snack",
                lunch: "Lunch",
                dinner: "Dinner",
            },
            wednesday: {
                breakfast: "Breakfast",
                snack: "Snack",
                lunch: "Lunch",
                dinner: "Dinner",
            },
            thursday: {
                breakfast: "Breakfast",
                snack: "Snack",
                lunch: "Lunch",
                dinner: "Dinner",
            },
            friday: {
                breakfast: "Breakfast",
                snack: "Snack",
                lunch: "Lunch",
                dinner: "Dinner",
            },
            saturday: {
                breakfast: "Breakfast",
                snack: "Snack",
                lunch: "Lunch",
                dinner: "Dinner",
            },
            sunday: {
                breakfast: "Breakfast",
                snack: "Snack",
                lunch: "Lunch",
                dinner: "Dinner",
            },
            currentDrag: "",
            currentDay: "",
            currentMeal: "",
            groceryList: [],
            scheduleRecipes: [],
            anchor: null,
            open: false,
            anchorDay: "",
            dayAnchor: null,
            menuId: "",
            clickAndDrag: "true",
            toggleOption: "drag"
        }
    }
    async componentDidMount()
    {

        //get basket data from server
        var basketIdStringsArray = await this.storeBasketIDs();
        console.log(basketIdStringsArray);

        // build string for recipe api call (basket)
        // to populate basket
        var stringOfIds = "";
        for (var i = 0; i < basketIdStringsArray.length; i++)
        {
            stringOfIds = stringOfIds + basketIdStringsArray[i];
            if (i != basketIdStringsArray.length - 1)
            {
                stringOfIds = stringOfIds + ",";
            }
        }

        //Retreive schedule
        let currentSchedule = [];
        currentSchedule = await DatabaseHandler("getSchedule", this.props.username);

        // build string for recipe api call (schedule)
        // to populate scheduleRecipe array
        var stringOfScheduleIds = "";
        for (var i = 0; i < currentSchedule.length; i++)
        {
            console.log(currentSchedule[i]);
            console.log(currentSchedule[i].charAt(0));
            console.log(currentSchedule[i].charAt(0).isAlpha);
            if (/^[A-Z]$/i.test(currentSchedule[i].charAt(0)) == false)
            {
                stringOfScheduleIds = stringOfScheduleIds + currentSchedule[i] + ",";
            }
        }
        if (stringOfScheduleIds.charAt(stringOfScheduleIds.length-1) == ",")
        {
            stringOfScheduleIds = stringOfScheduleIds.slice(0, -1);
        }
        console.log("scheduleIDs =" + stringOfScheduleIds);

        //API keys
        var stringAPIkey1 = "805e5c6f2aa0430f9339f0c977fe6a5e";
        var stringAPIkey2 = "776009e261104b10864e8a11347a4478";
        var stringAPIkey3 = "2e0b58c2c8eb4f10be5f5c02491158cb";
        var currentAPIkey = stringAPIkey2;

        console.log("stringOfIds= " + stringOfIds + "   stringOfscheduleIDs= " + stringOfScheduleIds);
        if (stringOfIds != "" && stringOfScheduleIds == "")
        {
            var request = new XMLHttpRequest();
            request.open('GET', 'https://api.spoonacular.com/recipes/informationBulk?ids=' + stringOfIds + '&includeNutrition=true&apiKey=' + currentAPIkey, true);
            request.send();
            request.onload = () =>  
            {

                console.log("in request");
                // Begin accessing JSON data here
                var data = JSON.parse(request.response);
                if (request.status >= 200 && request.status < 400) {
                    var length = Object.keys(data).length;

                    for(var i = 0; i < length; i++)
                    {
                        var result = data[i]; 
                        var recipe = new Object();
                        recipe.id = result.id.toString();
                        recipe.name = result.title;
                        var nutrients = result.nutrition["nutrients"];
                        var calories = nutrients[0].amount;
                        var servings = result.servings;
                        recipe.calories = calories;
                        recipe.calPerServing = Math.round(recipe.calories/servings);
                        var ingred = result.nutrition["ingredients"];
                        var ingredLength = ingred.length;
                        var ingredList = [];
                        for(var j=0; j<ingredLength; j++)
                        {
                            var ingredient = new Object();
                            ingredient.name = ingred[j].name;
                            ingredient.amount = ingred[j].amount;
                            ingredient.unit = ingred[j].unit;
                            ingredList.push(ingredient);
                        }
                        recipe.ingredients = ingredList;
                        var copy = this.state.basket;
                        copy.push(recipe);
                        this.setState({basket: copy}, () => console.log(this.state));
                    }
                    this.retreiveData();
                }
            }
        }

        if (stringOfIds == "" && stringOfScheduleIds != "")
        {
            request = new XMLHttpRequest();
            request.open('GET', 'https://api.spoonacular.com/recipes/informationBulk?ids=' + stringOfScheduleIds + '&includeNutrition=true&apiKey=' + currentAPIkey, true);
            request.send();
            request.onload = () =>  
            {

                console.log("in request");
                // Begin accessing JSON data here
                let data = JSON.parse(request.response);
                if (request.status >= 200 && request.status < 400) {
                    var length = Object.keys(data).length;

                    for(var i = 0; i < length; i++)
                    {
                        var result = data[i]; 
                        var recipe = new Object();
                        recipe.id = result.id.toString();
                        recipe.name = result.title;
                        var nutrients = result.nutrition["nutrients"];
                        var calories = nutrients[0].amount;
                        var servings = result.servings;
                        recipe.calories = calories;
                        recipe.calPerServing = Math.round(recipe.calories/servings);
                        var ingred = result.nutrition["ingredients"];
                        var ingredLength = ingred.length;
                        var ingredList = [];
                        for(var j=0; j<ingredLength; j++)
                        {
                            var ingredient = new Object();
                            ingredient.name = ingred[j].name;
                            ingredient.amount = ingred[j].amount;
                            ingredient.unit = ingred[j].unit;
                            ingredList.push(ingredient);
                        }
                        recipe.ingredients = ingredList;
                        var copy = this.state.scheduleRecipes;
                        copy.push(recipe);
                        this.setState({scheduleRecipes: copy}, () => console.log(this.state));
                    }
                    // After http request to fill basket, populate the schedule
                    this.retreiveData();
                }
            }
        }

        if (stringOfIds != "" && stringOfScheduleIds != "")
        {
            var request = new XMLHttpRequest();
            request.open('GET', 'https://api.spoonacular.com/recipes/informationBulk?ids=' + stringOfIds + '&includeNutrition=true&apiKey=' + currentAPIkey, true);
            request.send();
            request.onload = () =>  
            {

                console.log("in request");
                // Begin accessing JSON data here
                var data = JSON.parse(request.response);
                if (request.status >= 200 && request.status < 400) {
                    var length = Object.keys(data).length;

                    for(var i = 0; i < length; i++)
                    {
                        var result = data[i]; 
                        var recipe = new Object();
                        recipe.id = result.id.toString();
                        recipe.name = result.title;
                        var nutrients = result.nutrition["nutrients"];
                        var calories = nutrients[0].amount;
                        var servings = result.servings;
                        recipe.calories = calories;
                        recipe.calPerServing = Math.round(recipe.calories/servings);
                        var ingred = result.nutrition["ingredients"];
                        var ingredLength = ingred.length;
                        var ingredList = [];
                        for(var j=0; j<ingredLength; j++)
                        {
                            var ingredient = new Object();
                            ingredient.name = ingred[j].name;
                            ingredient.amount = ingred[j].amount;
                            ingredient.unit = ingred[j].unit;
                            ingredList.push(ingredient);
                        }
                        recipe.ingredients = ingredList;
                        var copy = this.state.basket;
                        copy.push(recipe);
                        this.setState({basket: copy}, () => console.log(this.state));
                    }
                    
                    request = new XMLHttpRequest();
                    request.open('GET', 'https://api.spoonacular.com/recipes/informationBulk?ids=' + stringOfScheduleIds + '&includeNutrition=true&apiKey=' + currentAPIkey, true);
                    request.send();
                    request.onload = () =>  
                    {

                        console.log("in request");
                        // Begin accessing JSON data here
                        data = JSON.parse(request.response);
                        if (request.status >= 200 && request.status < 400) {
                            var length = Object.keys(data).length;

                            for(var i = 0; i < length; i++)
                            {
                                var result = data[i]; 
                                var recipe = new Object();
                                recipe.id = result.id.toString();
                                recipe.name = result.title;
                                var nutrients = result.nutrition["nutrients"];
                                var calories = nutrients[0].amount;
                                var servings = result.servings;
                                recipe.calories = calories;
                                recipe.calPerServing = Math.round(recipe.calories/servings);
                                var ingred = result.nutrition["ingredients"];
                                var ingredLength = ingred.length;
                                var ingredList = [];
                                for(var j=0; j<ingredLength; j++)
                                {
                                    var ingredient = new Object();
                                    ingredient.name = ingred[j].name;
                                    ingredient.amount = ingred[j].amount;
                                    ingredient.unit = ingred[j].unit;
                                    ingredList.push(ingredient);
                                }
                                recipe.ingredients = ingredList;
                                var copy = this.state.scheduleRecipes;
                                copy.push(recipe);
                                this.setState({scheduleRecipes: copy}, () => console.log(this.state));
                            }
                            // After http request to fill basket, populate the schedule
                            this.retreiveData();
                        }
                    }
                }
            }
        }
    }

    buildScheduleString()
    {
        var scheduleString = ""

        // Monday data
        if (this.state.monday.breakfast != "")
            scheduleString = scheduleString + this.state.monday.breakfast;
        else {scheduleString = scheduleString + "null";}
        if (this.state.monday.snack != "")
            scheduleString = scheduleString + "," + this.state.monday.snack;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.monday.lunch != "")
            scheduleString = scheduleString + "," + this.state.monday.lunch;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.monday.dinner != "")
            scheduleString = scheduleString + "," + this.state.monday.dinner;
        else {scheduleString = scheduleString + ",null";}

        // Tuesday data
        if (this.state.tuesday.breakfast != "")
            scheduleString = scheduleString + "," + this.state.tuesday.breakfast;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.tuesday.snack != "")
            scheduleString = scheduleString + "," + this.state.tuesday.snack;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.tuesday.lunch != "")
            scheduleString = scheduleString + "," + this.state.tuesday.lunch;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.tuesday.dinner != "")
            scheduleString = scheduleString + "," + this.state.tuesday.dinner;
        else {scheduleString = scheduleString + ",null";}

        // Wednesday data
        if (this.state.wednesday.breakfast != "")
            scheduleString = scheduleString + "," + this.state.wednesday.breakfast;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.wednesday.snack != "")
            scheduleString = scheduleString + "," + this.state.wednesday.snack;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.wednesday.lunch != "")
            scheduleString = scheduleString + "," + this.state.wednesday.lunch;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.wednesday.dinner != "")
            scheduleString = scheduleString + "," + this.state.wednesday.dinner;
        else {scheduleString = scheduleString + ",null";}

        // Thursday data
        if (this.state.thursday.breakfast != "")
            scheduleString = scheduleString + "," + this.state.thursday.breakfast;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.thursday.snack != "")
            scheduleString = scheduleString + "," + this.state.thursday.snack;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.thursday.lunch != "")
            scheduleString = scheduleString + "," + this.state.thursday.lunch;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.thursday.dinner != "")
            scheduleString = scheduleString + "," + this.state.thursday.dinner;
        else {scheduleString = scheduleString + ",null";}

        // Friday data
        if (this.state.friday.breakfast != "")
            scheduleString = scheduleString + "," + this.state.friday.breakfast;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.friday.snack != "")
            scheduleString = scheduleString + "," + this.state.friday.snack;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.friday.lunch != "")
            scheduleString = scheduleString + "," + this.state.friday.lunch;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.friday.dinner != "")
            scheduleString = scheduleString + "," + this.state.friday.dinner;
        else {scheduleString = scheduleString + ",null";}

        // Saturday data
        if (this.state.saturday.breakfast != "")
            scheduleString = scheduleString + "," + this.state.saturday.breakfast;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.saturday.snack != "")
            scheduleString = scheduleString + "," + this.state.saturday.snack;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.saturday.lunch != "")
            scheduleString = scheduleString + "," + this.state.saturday.lunch;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.saturday.dinner != "")
            scheduleString = scheduleString + "," + this.state.saturday.dinner;
        else {scheduleString = scheduleString + ",null";}

        // Sunday data
        if (this.state.sunday.breakfast != "")
            scheduleString = scheduleString + "," + this.state.sunday.breakfast;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.sunday.snack != "")
            scheduleString = scheduleString + "," + this.state.sunday.snack;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.sunday.lunch != "")
            scheduleString = scheduleString + "," + this.state.sunday.lunch;
        else {scheduleString = scheduleString + ",null";}
        if (this.state.sunday.dinner != "")
            scheduleString = scheduleString + "," + this.state.sunday.dinner;
        else {scheduleString = scheduleString + ",null";}

        return scheduleString;
    }

    findRecipe(id)
    {
        for (var i=0; i<this.state.basket.length; i++)
        {
            var recipe = this.state.basket[i];
            if (recipe.id.toString() === id.toString())
            {
                return recipe
            }
        }
        for (var i=0; i<this.state.scheduleRecipes.length; i++)
        {
            var recipe = this.state.scheduleRecipes[i];
            if (recipe.id.toString() === id.toString())
            {
                return recipe
            }
        }
        return null;

    }

    resetSlot(day, meal)
    {
        if (day === "monday")
        {
            var copy = this.state.monday;
            if(meal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(meal === "snack")
            {
                copy.snack = "Snack";
                
            }
            else if(meal === "lunch")
            {
                copy.lunch = "Lunch";
                
            }
            else if(meal === "dinner")
            {
                copy.dinner = "Dinner";
                
            }
            this.setState({monday: copy}, () => console.log(this.state));
        }
        else if (day === "tuesday")
        {
            var copy = this.state.tuesday;
            if(meal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(meal === "snack")
            {
                copy.snack = "Snack";
                
            }
            else if(meal === "lunch")
            {
                copy.lunch = "Lunch";
                
            }
            else if(meal === "dinner")
            {
                copy.dinner = "Dinner";
                
            }
            this.setState({tuesday: copy}, () => console.log(this.state));
        }
        else if (day === "wednesday")
        {
            var copy = this.state.wednesday;
            if(meal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(meal === "snack")
            {
                copy.snack = "Snack";
                
            }
            else if(meal === "lunch")
            {
                copy.lunch = "Lunch";
                
            }
            else if(meal === "dinner")
            {
                copy.dinner = "Dinner";
                
            }
            this.setState({wednesday: copy}, () => console.log(this.state));
        }
        else if (day === "thursday")
        {
            var copy = this.state.thursday;
            if(meal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(meal === "snack")
            {
                copy.snack = "Snack";
                
            }
            else if(meal === "lunch")
            {
                copy.lunch = "Lunch";
                
            }
            else if(meal === "dinner")
            {
                copy.dinner = "Dinner";
                
            }
            this.setState({thursday: copy}, () => console.log(this.state));
        }
        else if (day === "friday")
        {
            var copy = this.state.friday;
            if(meal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(meal === "snack")
            {
                copy.snack = "Snack";
                
            }
            else if(meal === "lunch")
            {
                copy.lunch = "Lunch";
                
            }
            else if(meal === "dinner")
            {
                copy.dinner = "Dinner";
                
            }
            this.setState({friday: copy}, () => console.log(this.state));
        }
        else if (day === "saturday")
        {
            var copy = this.state.saturday;
            if(meal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(meal === "snack")
            {
                copy.snack = "Snack";
                
            }
            else if(meal === "lunch")
            {
                copy.lunch = "Lunch";
                
            }
            else if(meal === "dinner")
            {
                copy.dinner = "Dinner";
                
            }
            this.setState({saturday: copy}, () => console.log(this.state));
        }
        else if (day === "sunday")
        {
            var copy = this.state.sunday;
            if(meal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(meal === "snack")
            {
                copy.snack = "Snack";
                
            }
            else if(meal === "lunch")
            {
                copy.lunch = "Lunch";
                
            }
            else if(meal === "dinner")
            {
                copy.dinner = "Dinner";
                
            }
            this.setState({sunday: copy}, () => console.log(this.state));
        }

    }

    onDrag = (e) => {
        var dragID = e.target.id;
        this.setState({currentDrag: dragID}, () => console.log(this.state));

    }
    onDrop = (e, meal) => {
        if(this.state.currentDrag != "")
        {
            var dragged = this.state.currentDrag;
            if (meal === "mondaybreakfast")
            {
                var mon = this.state.monday;
                mon.breakfast = dragged;
                this.setState({monday: mon, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "mondaysnack")
            {
                console.log(this.state.currentDrag);
                var mon = this.state.monday;
                mon.snack = dragged;
                this.setState({monday: mon, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "mondaylunch")
            {
                var mon = this.state.monday;
                mon.lunch = dragged;
                this.setState({monday: mon, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "mondaydinner")
            {
                var mon = this.state.monday;
                mon.dinner = dragged;
                this.setState({monday: mon, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "tuesdaybreakfast")
            {
                var tues = this.state.tuesday;
                tues.breakfast = dragged;
                this.setState({tuesday: tues, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "tuesdaysnack")
            {
                var tues = this.state.tuesday;
                tues.snack = dragged;
                this.setState({tuesday: tues, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "tuesdaylunch")
            {
                var tues = this.state.tuesday;
                tues.lunch = dragged;
                this.setState({tuesday: tues, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "tuesdaydinner")
            {
                var tues = this.state.tuesday;
                tues.dinner = dragged;
                this.setState({tuesday: tues, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "wednesdaybreakfast")
            {
                var wed = this.state.wednesday;
                wed.breakfast = dragged;
                this.setState({wednesday: wed, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "wednesdaysnack")
            {
                var wed = this.state.wednesday;
                wed.snack = dragged;
                this.setState({wednesday: wed, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "wednesdaylunch")
            {
                var wed = this.state.wednesday;
                wed.lunch = dragged;
                this.setState({wednesday: wed, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "wednesdaydinner")
            {
                var wed = this.state.wednesday;
                wed.dinner = dragged;
                this.setState({wednesday: wed, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "thursdaybreakfast")
            {
                var thurs = this.state.thursday;
                thurs.breakfast = dragged;
                this.setState({thursday: thurs, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "thursdaysnack")
            {
                var thurs = this.state.thursday;
                thurs.snack = dragged;
                this.setState({thursday: thurs, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "thursdaylunch")
            {
                var thurs = this.state.thursday;
                thurs.lunch = dragged;
                this.setState({thursday: thurs, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "thursdaydinner")
            {
                var thurs = this.state.thursday;
                thurs.dinner = dragged;
                this.setState({thursday: thurs, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "fridaybreakfast")
            {
                var fri = this.state.friday;
                fri.breakfast = dragged;
                this.setState({friday: fri, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "fridaysnack")
            {
                var fri = this.state.friday;
                fri.snack = dragged;
                this.setState({friday: fri, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "fridaylunch")
            {
                var fri = this.state.friday;
                fri.lunch = dragged;
                this.setState({friday: fri, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "fridaydinner")
            {
                var fri = this.state.friday;
                fri.dinner = dragged;
                this.setState({friday: fri, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "saturdaybreakfast")
            {
                var sat = this.state.saturday;
                sat.breakfast = dragged;
                this.setState({saturday: sat, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "saturdaysnack")
            {
                var sat = this.state.saturday;
                sat.snack = dragged;
                this.setState({saturday: sat, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "saturdaylunch")
            {
                var sat = this.state.saturday;
                sat.lunch = dragged;
                this.setState({saturday: sat, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "saturdaydinner")
            {
                var sat = this.state.saturday;
                sat.dinner = dragged;
                this.setState({saturday: sat, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "saturdaybreakfast")
            {
                var sat = this.state.saturday;
                sat.breakfast = dragged;
                this.setState({saturday: sat, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "saturdaysnack")
            {
                var sat = this.state.saturday;
                sat.snack = dragged;
                this.setState({saturday: sat, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "saturdaylunch")
            {
                var sat = this.state.saturday;
                sat.lunch = dragged;
                this.setState({saturday: sat, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "saturdaydinner")
            {
                var sat = this.state.saturday;
                sat.dinner = dragged;
                this.setState({saturday: sat, currentDrag: ""}, ()=>console.log(this.state));
            }else if (meal === "sundaybreakfast")
            {
                var sun = this.state.sunday;
                sun.breakfast = dragged;
                this.setState({sunday: sun, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "sundaysnack")
            {
                var sun = this.state.sunday;
                sun.snack = dragged;
                this.setState({sunday: sun, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "sundaylunch")
            {
                var sun = this.state.sunday;
                sun.lunch = dragged;
                this.setState({sunday: sun, currentDrag: ""}, ()=>console.log(this.state));
            }
            else if (meal === "sundaydinner")
            {
                var sun = this.state.sunday;
                sun.dinner = dragged;
                this.setState({sunday: sun, currentDrag: ""}, ()=>console.log(this.state));
            }
        }
        if(this.state.currentDay === "monday")
        {
            var copy = this.state.monday;
            if(this.state.currentMeal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(this.state.currentMeal === "snack")
            {
                copy.snack = "Snack";

            }
            else if(this.state.currentMeal === "lunch")
            {
                copy.lunch = "Lunch";

            }
            else if(this.state.currentMeal === "dinner")
            {
                copy.dinner = "Dinner";

            }
            this.setState({monday: copy, currentDay: "", currentMeal: "" }, () => console.log(this.state));

        }
        else if(this.state.currentDay == "tuesday")
        {
            var copy = this.state.tuesday;
            if(this.state.currentMeal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(this.state.currentMeal === "snack")
            {
                copy.snack = "Snack";

            }
            else if(this.state.currentMeal === "lunch")
            {
                copy.lunch = "Lunch";

            }
            else if(this.state.currentMeal === "dinner")
            {
                copy.dinner = "Dinner";

            }
            this.setState({tuesday: copy, currentDay: "", currentMeal: "" }, () => console.log(this.state));
        }
        else if(this.state.currentDay == "wednesday")
        {
            var copy = this.state.wednesday;
            if(this.state.currentMeal === "breakfast")
            {
                copy.breakfast = "Breakfast";
                this.setState({})

            }
            else if(this.state.currentMeal === "snack")
            {
                copy.snack = "Snack";

            }
            else if(this.state.currentMeal === "lunch")
            {
                copy.lunch = "Lunch";

            }
            else if(this.state.currentMeal === "dinner")
            {
                copy.dinner = "Dinner";

            }
            this.setState({wednesday: copy, currentDay: "", currentMeal: "" }, () => console.log(this.state));
        }
        else if(this.state.currentDay == "thursday")
        {
            var copy = this.state.thursday;
            if(this.state.currentMeal === "breakfast")
            {
                copy.breakfast = "Breakfast";
                this.setState({})

            }
            else if(this.state.currentMeal === "snack")
            {
                copy.snack = "Snack";

            }
            else if(this.state.currentMeal === "lunch")
            {
                copy.lunch = "Lunch";

            }
            else if(this.state.currentMeal === "dinner")
            {
                copy.dinner = "Dinner";

            }
            this.setState({thursday: copy, currentDay: "", currentMeal: "" }, () => console.log(this.state));
        }
        else if(this.state.currentDay == "friday")
        {
            var copy = this.state.friday;
            if(this.state.currentMeal === "breakfast")
            {
                copy.breakfast = "Breakfast";
                this.setState({})

            }
            else if(this.state.currentMeal === "snack")
            {
                copy.snack = "Snack";

            }
            else if(this.state.currentMeal === "lunch")
            {
                copy.lunch = "Lunch";

            }
            else if(this.state.currentMeal === "dinner")
            {
                copy.dinner = "Dinner";

            }
            this.setState({friday: copy, currentDay: "", currentMeal: "" }, () => console.log(this.state));
        }
        else if(this.state.currentDay == "saturday")
        {
            var copy = this.state.saturday;
            if(this.state.currentMeal === "breakfast")
            {
                copy.breakfast = "Breakfast";
                this.setState({})

            }
            else if(this.state.currentMeal === "snack")
            {
                copy.snack = "Snack";

            }
            else if(this.state.currentMeal === "lunch")
            {
                copy.lunch = "Lunch";

            }
            else if(this.state.currentMeal === "dinner")
            {
                copy.dinner = "Dinner";

            }
            this.setState({saturday: copy, currentDay: "", currentMeal: "" }, () => console.log(this.state));
        }
        else if(this.state.currentDay == "sunday")
        {
            var copy = this.state.sunday;
            if(this.state.currentMeal === "breakfast")
            {
                copy.breakfast = "Breakfast";

            }
            else if(this.state.currentMeal === "snack")
            {
                copy.snack = "Snack";

            }
            else if(this.state.currentMeal === "lunch")
            {
                copy.lunch = "Lunch";

            }
            else if(this.state.currentMeal === "dinner")
            {
                copy.dinner = "Dinner";

            }
            this.setState({sunday: copy, currentDay: "", currentMeal: "" }, () => console.log(this.state));
        }
    }

    onDragRec = (e, day, meal) => {
        var dragID = e.target.id;
        
        this.setState({currentDrag: dragID, currentDay: day, currentMeal: meal}, () => console.log(this.state));
        
    }

    calculateDailyCal(day)
    {
        var totalCal = 0;
        if(day === "monday")
        {
            if(this.state.monday.breakfast!="Breakfast")
            {
                var br = this.findRecipe(this.state.monday.breakfast);
                totalCal += br.calPerServing;
            }
            if(this.state.monday.snack!="Snack")
            {
                var sn = this.findRecipe(this.state.monday.snack);
                totalCal += sn.calPerServing;
            }
            if(this.state.monday.lunch!="Lunch")
            {
                var lu = this.findRecipe(this.state.monday.lunch);
                totalCal += lu.calPerServing;
            }
            if(this.state.monday.dinner!="Dinner")
            {
                var di = this.findRecipe(this.state.monday.dinner);
                totalCal += di.calPerServing;
            }
        }
        else if(day === "tuesday")
        {
            if(this.state.tuesday.breakfast!="Breakfast")
            {
                var br = this.findRecipe(this.state.tuesday.breakfast);
                totalCal += br.calPerServing;
            }
            if(this.state.tuesday.snack!="Snack")
            {
                var sn = this.findRecipe(this.state.tuesday.snack);
                totalCal += sn.calPerServing;
            }
            if(this.state.tuesday.lunch!="Lunch")
            {
                var lu = this.findRecipe(this.state.tuesday.lunch);
                totalCal += lu.calPerServing;
            }
            if(this.state.tuesday.dinner!="Dinner")
            {
                var di = this.findRecipe(this.state.tuesday.dinner);
                totalCal += di.calPerServing;
            }
            
        }
        else if(day === "wednesday")
        {
            if(this.state.wednesday.breakfast!="Breakfast")
            {
                var br = this.findRecipe(this.state.wednesday.breakfast);
                totalCal += br.calPerServing;
            }
            if(this.state.wednesday.snack!="Snack")
            {
                var sn = this.findRecipe(this.state.wednesday.snack);
                totalCal += sn.calPerServing;
            }
            if(this.state.wednesday.lunch!="Lunch")
            {
                var lu = this.findRecipe(this.state.wednesday.lunch);
                totalCal += lu.calPerServing;
            }
            if(this.state.wednesday.dinner!="Dinner")
            {
                var di = this.findRecipe(this.state.wednesday.dinner);
                totalCal += di.calPerServing;
            }
            
        }
        else if(day === "thursday")
        {
            if(this.state.thursday.breakfast!="Breakfast")
            {
                var br = this.findRecipe(this.state.thursday.breakfast);
                totalCal += br.calPerServing;
            }
            if(this.state.thursday.snack!="Snack")
            {
                var sn = this.findRecipe(this.state.thursday.snack);
                totalCal += sn.calPerServing;
            }
            if(this.state.thursday.lunch!="Lunch")
            {
                var lu = this.findRecipe(this.state.thursday.lunch);
                totalCal += lu.calPerServing;
            }
            if(this.state.thursday.dinner!="Dinner")
            {
                var di = this.findRecipe(this.state.thursday.dinner);
                totalCal += di.calPerServing;
            }
        }
        else if(day === "friday")
        {
            if(this.state.friday.breakfast!="Breakfast")
            {
                var br = this.findRecipe(this.state.friday.breakfast);
                totalCal += br.calPerServing;
            }
            if(this.state.friday.snack!="Snack")
            {
                var sn = this.findRecipe(this.state.friday.snack);
                totalCal += sn.calPerServing;
            }
            if(this.state.friday.lunch!="Lunch")
            {
                var lu = this.findRecipe(this.state.friday.lunch);
                totalCal += lu.calPerServing;
            }
            if(this.state.friday.dinner!="Dinner")
            {
                var di = this.findRecipe(this.state.friday.dinner);
                totalCal += di.calPerServing;
            }
        }
        else if(day === "saturday")
        {
            if(this.state.saturday.breakfast!="Breakfast")
            {
                var br = this.findRecipe(this.state.saturday.breakfast);
                totalCal += br.calPerServing;
            }
            if(this.state.saturday.snack!="Snack")
            {
                var sn = this.findRecipe(this.state.saturday.snack);
                totalCal += sn.calPerServing;
            }
            if(this.state.saturday.lunch!="Lunch")
            {
                var lu = this.findRecipe(this.state.saturday.lunch);
                totalCal += lu.calPerServing;
            }
            if(this.state.saturday.dinner!="Dinner")
            {
                var di = this.findRecipe(this.state.saturday.dinner);
                totalCal += di.calPerServing;
            }
        }
        else if(day === "sunday")
        {
            if(this.state.sunday.breakfast!="Breakfast")
            {
                var br = this.findRecipe(this.state.sunday.breakfast);
                totalCal += br.calPerServing;
            }
            if(this.state.sunday.snack!="Snack")
            {
                var sn = this.findRecipe(this.state.sunday.snack);
                totalCal += sn.calPerServing;
            }
            if(this.state.sunday.lunch!="Lunch")
            {
                var lu = this.findRecipe(this.state.sunday.lunch);
                totalCal += lu.calPerServing;
            }
            if(this.state.sunday.dinner!="Dinner")
            {
                var di = this.findRecipe(this.state.sunday.dinner);
                totalCal += di.calPerServing;
            }
        }
        return totalCal;
    }
    
    findIngredient(name, unit, copy)
    {
        for(var i=0; i< copy.length; i++)
        {
            var ingred = copy[i];
            if (ingred.name === name && ingred.unit === unit)
            {
                return i;
            }
        }
        return -1;
    }

    async generateGroceryList()
    {
        this.setState({groceryList: []}, ()=>console.log(this.state));
        const copy = this.state.groceryList;
        await copy.splice(0,copy.length);
        console.log("copy");
        console.log(copy.length);
        if(this.state.monday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.monday.breakfast);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, copy);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.monday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.monday.snack);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, copy);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }

        }
        if(this.state.monday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.monday.lunch);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.monday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.monday.dinner);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.tuesday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.tuesday.breakfast);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.tuesday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.tuesday.snack);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }

        }
        if(this.state.tuesday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.tuesday.lunch);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.tuesday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.tuesday.dinner);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.wednesday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.wednesday.breakfast);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.wednesday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.wednesday.snack);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, copy);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }

        }
        if(this.state.wednesday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.wednesday.lunch);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.wednesday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.wednesday.dinner);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.thursday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.thursday.breakfast);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.thursday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.thursday.snack);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }

        }
        if(this.state.thursday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.thursday.lunch);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.thursday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.thursday.dinner);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.friday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.friday.breakfast);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.friday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.friday.snack);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }

        }
        if(this.state.friday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.friday.lunch);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.friday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.friday.dinner);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.saturday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.saturday.breakfast);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.saturday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.saturday.snack);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }

        }
        if(this.state.saturday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.saturday.lunch);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.saturday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.saturday.dinner);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.sunday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.sunday.breakfast);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.sunday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.sunday.snack);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }

        }
        if(this.state.sunday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.sunday.lunch);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        if(this.state.sunday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.sunday.dinner);
            var ingredients = recipe.ingredients;
            for (var i = 0; i < ingredients.length; i++)
            {
                var index = this.findIngredient(ingredients[i].name, ingredients[i].unit, this.state.groceryList);
                if (index == -1)
                {
                    copy.push(ingredients[i]);
                }
                else
                {
                    copy[index].amount += ingredients[i].amount;
                }
            }
        }
        console.log(copy);
        this.setState({groceryList: copy}, () => console.log(this.state));
        //copy.splice(0,copy.length);
    }

    async storeBasketIDs()
    {

        //Populate basket
        // get recipies string
        let dh = "null";
        dh = await new DatabaseHandler("getRecipes", this.props.username);
        var basket_recipes_string = "";
        var basket_recipes_array = [];

        if (dh != "null")
        {
            if (dh != null && dh.length != 0 && dh != "null")
            {
                basket_recipes_string = dh.split('*')[0];
            }

            // debugging
            //console.log("dh returned:" + dh);
            //console.log("basket_recipes_string=" + basket_recipes_string);

            if (dh.split('*').length > 1 && basket_recipes_string.length != 0)
            {
                basket_recipes_array = basket_recipes_string.split(',');
            }
        }
        if (dh.split('*').length > 1 && basket_recipes_array.length != 0)
        {
            //this.fixScheduleToBasket(basket_recipes_array);
            return basket_recipes_array;
        }
        else
        {
            //this.fixScheduleToBasket([]);
            return [];
        }
    }

    async retreiveData()
    {
        //get the array of basket ids, the ids for the schedule (dont worry too much about this one)
        // store them in the state with the call this.setState({basket: serverbasket, monday: servermonday, tuesday: servertuesday}, ()=>console.log(this.state)) 
        //the console.log will show you the current state in inspect. use that to ensure the data is being loaded correctly.
        //this will be called at the beginning of componentDidMount in final version but can be called using the corresponding button

        //Retreive schedule
        let dh = [];
        dh = await DatabaseHandler("getSchedule", this.props.username);

        if(dh[0] != "null")
        {
            //Change whats in schedule for monday
            var copy = this.state.monday;
            copy.breakfast = dh[0];
            copy.snack = dh[1];
            copy.lunch = dh[2];
            copy.dinner = dh[3];
            this.setState({monday: copy});

            //Change whats in schedule for tuesday
            var copy = this.state.tuesday;
            copy.breakfast = dh[4];
            copy.snack = dh[5];
            copy.lunch = dh[6];
            copy.dinner = dh[7];
            this.setState({tuesday: copy});

            //Change whats in schedule for wednesday
            var copy = this.state.wednesday;
            copy.breakfast = dh[8];
            copy.snack = dh[9];
            copy.lunch = dh[10];
            copy.dinner = dh[11];
            this.setState({wednesday: copy});

            //Change whats in schedule for thursday
            var copy = this.state.thursday;
            copy.breakfast = dh[12];
            copy.snack = dh[13];
            copy.lunch = dh[14];
            copy.dinner = dh[15];
            this.setState({thursday: copy});

            //Change whats in schedule for friday
            var copy = this.state.friday;
            copy.breakfast = dh[16];
            copy.snack = dh[17];
            copy.lunch = dh[18];
            copy.dinner = dh[19];
            this.setState({friday: copy});

            //Change whats in schedule for saturday
            var copy = this.state.saturday;
            copy.breakfast = dh[20];
            copy.snack = dh[21];
            copy.lunch = dh[22];
            copy.dinner = dh[23];
            this.setState({saturday: copy});

            //Change whats in schedule for sunday
            var copy = this.state.sunday;
            copy.breakfast = dh[24];
            copy.snack = dh[25];
            copy.lunch = dh[26];
            copy.dinner = dh[27];
            this.setState({sunday: copy});
        }
        else
        {
            //do nothing, the user currently has no schedule
        }


    }

    async storeData()
    {
        //store the state into the server; store the array of basket ids
        // to get the array call this.state.basket, this.state.monday.breakfast, this.state.sunday.dinner, etc.
        //the array should show up using pgadmin or whatever you use to see the database
        //this will be called when clicking on the nav bar in the final version but can be called using the corresponding button
        //before storing the basket and schedule, make sure to delete the old basket and schedule corresponding to the username

        //Store schedule
        let schedule_string = this.buildScheduleString();
        console.log(schedule_string);
        let dh = false;
        dh = await DatabaseHandler("saveSchedule", this.props.username, "null", "null", "null", "null", schedule_string);
    }

    goToPage(page)
    {
        //save state to server here
        this.storeData();
        this.props.updateCurrentComponent(page);
    }

    async clearBasketAndSchedule()
    {
        var day = {
            breakfast: "Breakfast",
            snack: "Snack",
            lunch: "Lunch",
            dinner: "Dinner"
        };
        var empty = [];
        this.setState({monday: day, tuesday: day, wednesday: day, thursday: day, friday: day, saturday: day, sunday: day, basket: empty, scheduleRecipes: empty}, ()=>console.log(this.state));

        // make the recipe_id_string
        // "id,id,id,id,id,id,id,id*id,id,id,id,id,id,id"
        // ......basket_ids........^.....favorite_ids....
        // if empty string will be = "*"
        var recipe_id_string = "*";
        var i;
        for (i = 0; i < this.state.basket.length; i++) {
            recipe_id_string = recipe_id_string + this.state.basket[i] + ",";
        }
        if (recipe_id_string.charAt(recipe_id_string.length - 1) == ",")
        {
            recipe_id_string = recipe_id_string.slice(0, -1);
        }
        console.log("recipe_id_string in scheduler right before saving = " + recipe_id_string);

        let dh = false;
        dh = await new DatabaseHandler("saveRecipes", this.props.username, "null", "null", "null", recipe_id_string, "null");

    }


    openMenu(event, name, id)
    {
        if(this.state.clickAndDrag === "false")
        {
            if(name === "recipe")
            {
                this.setState({anchor: event.currentTarget, open: true, menuId: id}, ()=> console.log(this.state));
            }
        else
            {
                this.setState({dayAnchor: event.currentTarget, anchorDay: name }, ()=>console.log(this.state));
            }
        }
    }

    closeMenu()
    {
        this.setState({anchor: null, open: false, anchorDay: ""}, ()=>console.log(this.state));
    }
    
    addRecipe(day, meal)
    {
        if(this.state.clickAndDrag === "false")
        {
            if(day === "monday")
            {
                var copy = this.state.monday;
                if(meal === "breakfast")
                {
                    copy.breakfast = this.state.menuId;
                    console.log("setting new breakfast");
                }
                else if (meal === "snack")
                {
                    copy.snack = this.state.menuId;
                }            
                else if(meal === "lunch")
                {
                    copy.lunch = this.state.menuId;
                }
                else if (meal === "dinner")
                {
                    copy.dinner = this.state.menuId;
                }
                this.setState({monday: copy}, ()=>console.log(this.state));
            }
            else if(day === "tuesday")
            {
                var copy = this.state.tuesday;
                if(meal === "breakfast")
                {
                    copy.breakfast = this.state.menuId;
                }
                else if (meal === "snack")
                {
                    copy.snack = this.state.menuId;
                }            
                else if(meal === "lunch")
                {
                    copy.lunch = this.state.menuId;
                }
                else if (meal === "dinner")
                {
                    copy.dinner = this.state.menuId;
                }
                this.setState({tuesday: copy}, ()=>console.log(this.state));
            }
            else if(day === "wednesday")
            {
                var copy = this.state.wednesday;
                if(meal === "breakfast")
                {
                    copy.breakfast = this.state.menuId;
                }
                else if (meal === "snack")
                {
                    copy.snack = this.state.menuId;
                }            
                else if(meal === "lunch")
                {
                    copy.lunch = this.state.menuId;
                }
                else if (meal === "dinner")
                {
                    copy.dinner = this.state.menuId;
                }
                this.setState({wednesday: copy}, ()=>console.log(this.state));
            }
            else if(day === "thursday")
            {
                var copy = this.state.thursday;
                if(meal === "breakfast")
                {
                    copy.breakfast = this.state.menuId;
                }
                else if (meal === "snack")
                {
                    copy.snack = this.state.menuId;
                }            
                else if(meal === "lunch")
                {
                    copy.lunch = this.state.menuId;
                }
                else if (meal === "dinner")
                {
                    copy.dinner = this.state.menuId;
                }
                this.setState({thursday: copy}, ()=>console.log(this.state));
            }
            else if(day === "friday")
            {
                var copy = this.state.friday;
                if(meal === "breakfast")
                {
                    copy.breakfast = this.state.menuId;
                }
                else if (meal === "snack")
                {
                    copy.snack = this.state.menuId;
                }            
                else if(meal === "lunch")
                {
                    copy.lunch = this.state.menuId;
                }
                else if (meal === "dinner")
                {
                    copy.dinner = this.state.menuId;
                }
                this.setState({friday: copy}, ()=>console.log(this.state));
            }
            else if(day === "saturday")
            {
                var copy = this.state.saturday;
                if(meal === "breakfast")
                {
                    copy.breakfast = this.state.menuId;
                }
                else if (meal === "snack")
                {
                    copy.snack = this.state.menuId;
                }            
                else if(meal === "lunch")
                {
                    copy.lunch = this.state.menuId;
                }
                else if (meal === "dinner")
                {
                    copy.dinner = this.state.menuId;
                }
                this.setState({saturday: copy}, ()=>console.log(this.state));
            }
            else if(day === "sunday")
            {
                var copy = this.state.sunday;
                if(meal === "breakfast")
                {
                    copy.breakfast = this.state.menuId;
                }
                else if (meal === "snack")
                {
                    copy.snack = this.state.menuId;
                }            
                else if(meal === "lunch")
                {
                    copy.lunch = this.state.menuId;
                }
                else if (meal === "dinner")
                {
                    copy.dinner = this.state.menuId;
                }
                this.setState({sunday: copy}, ()=>console.log(this.state));
            }
            this.closeMenu();
        }

    }
    
    changeToggle()
    {
        if(this.state.toggleOption === "drag")
        {
            this.setState({toggleOption: "click", clickAndDrag: "false"}, ()=>console.log(this.state));
        }
        else
        {
            this.setState({toggleOption: "drag", clickAndDrag: "true", anchor: null, open: false, anchorDay: "", dayAnchor: null, menuId: ""}, ()=>console.log(this.state))
        }
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
            marginTop: "30px",
            marginBottom: "10px",
            marginLeft: "45px",
            
        },
        headers: {
            backgroundColor: "#0f0997",
            color: "#fcfcff",
            marginTop: "-8px",
            textAlign: "center",
        },
        card:{
            width: "180px",
            height: "60px",
            fontSize: "11px",
            backgroundColor: "#d6dafc",
            variant: "outlined",
        },
        close:{
            marginLeft: "160px",
        },
        basket: {
            width: "200px",
            height: "414px",
            overflowY: "scroll",
            marginLeft: "15px",
            marginRight: "50x",
        },
        recipe: {
            height: "45px",
            fontSize: "14px",
        },
        blankSlot: {
            width: "180px",
            height: "60px",
            fontSize: "20px",
            textAlign: "center",
            color: "#6b6c6c",
        },
        schedule: {
            marginLeft: "40px",
        },
        indRecipe: {
            backgroundColor: "#d6dafc",
        },
        toggleGroup: {
            marginLeft: "15px",
            marginTop: "30px",
            marginBottom: "30px",
        },
        toggled: {
            backgroundColor: "#0f0997",
            color: "#fcfcff",
        },
        notToggled: {
            color: "#020117",
            backgroundColor: "#d6dafc",
        },
        groceryList: {
            marginLeft: "15px"
        },
        instruction: {
            marginLeft: "10px"
        }

    };

    render()
    {
        var classes = this.useStyles;
        return(
            <div>
                <AppBar position="static" style = {classes.bar}>
                    <Toolbar>
                    <Button color = "inherit" onClick = {()=>this.goToPage("home")}>Home</Button>
                    <Button color = "inherit" onClick = {()=>this.goToPage("profile")}>Profile</Button>
                    <Button color = "inherit" onClick = {()=>this.goToPage("favorites")}>Favorites</Button>
                    <Typography style = {{marginLeft: "5px", marginRight: "7px"}} variant="h6">
                        Scheduler
                    </Typography>
                    <Grid style = {{width: "90%", height: "30px"}} container justify="flex-end"><Button color = "inherit" onClick = {()=>this.goToPage("signin")}>Sign Out</Button></Grid>
                    </Toolbar>
                </AppBar>
                <div>
                    <ToggleButtonGroup style = {classes.toggleGroup} value={this.state.toggleOption} exclusive onChange={()=>this.changeToggle()}>
                        <ToggleButton style = {this.state.toggleOption === "drag" ? classes.toggled : classes.notToggled} value="drag" >
                            <div>Drag</div>
                        </ToggleButton>
                        <ToggleButton style = {this.state.toggleOption !== "drag" ? classes.toggled : classes.notToggled} value="click">
                            <div>Click</div>
                        </ToggleButton>
                    </ToggleButtonGroup>
                    {this.state.toggleOption==="drag"? <spam style  ={classes.instruction}>Click and Drag Recipes from the Basket into the Meal Slots to Build Your Weekly Schedule</spam> : <spam style = {classes.instruction}>Click on a Recipe and Select the Day and Meal Option to Build Your Weekly Schedule</spam>}
                    <Grid container> 
                        <Box border = {1} style = {classes.basket}>
                            <List>
                                <ListItem style = {classes.headers}>
                                    <ListItemText >Basket</ListItemText>
                                </ListItem>
                                {this.state.basket.map((recipe,index) => {
                                    return (
                                        <div 
                                            style = {classes.indRecipe}
                                            id = {recipe.id}
                                            draggable = {this.state.clickAndDrag}
                                            onDragStart = {e => this.onDrag(e)}
                                            >
                                        <Divider/>
                                        <ListItem
                                        key = {index}
                                        onClick = {e => this.openMenu(e, "recipe", recipe.id)}>
                                            <div style = {classes.recipe}>{recipe.name}</div>
                                        </ListItem>
                                        <Menu
                                        anchorEl = {this.state.anchor}
                                        keepMounted
                                        open={this.state.open}
                                        onClose={()=>this.closeMenu()}>
                                            <MenuItem onClick = {e =>this.openMenu(e,"monday", "")}>Monday</MenuItem>
                                            <MenuItem onClick = {e =>this.openMenu(e,"tuesday", "")}>Tuesday</MenuItem>
                                            <MenuItem onClick = {e =>this.openMenu(e,"wednesday", "")}>Wednesday</MenuItem>
                                            <MenuItem onClick = {e =>this.openMenu(e,"thursday", "")}>Thursday</MenuItem>
                                            <MenuItem onClick = {e =>this.openMenu(e,"friday", "")}>Friday</MenuItem>
                                            <MenuItem onClick = {e =>this.openMenu(e,"saturday", "")}>Saturday</MenuItem>
                                            <MenuItem onClick = {e =>this.openMenu(e,"sunday", "")}>Sunday</MenuItem>

                                        </Menu>
                                        <Menu
                                            anchorEl = {this.state.dayAnchor}
                                            keepMounted
                                            open={this.state.anchorDay==="monday"}
                                            style = {{marginLeft: "114px"}}
                                            onClose={()=>this.closeMenu()}>
                                                <MenuItem onClick = {()=>this.addRecipe( "monday", "breakfast")}>Breakfast</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("monday", "snack")}>Snack</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("monday", "lunch")}>Lunch</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("monday", "dinner")}>Dinner</MenuItem>
                                        </Menu>
                                        <Menu
                                            anchorEl = {this.state.dayAnchor}
                                            keepMounted
                                            open={this.state.anchorDay==="tuesday"}
                                            style = {{marginLeft: "114px"}}
                                            onClose={()=>this.closeMenu()}>
                                                <MenuItem onClick = {()=>this.addRecipe("tuesday", "breakfast")}>Breakfast</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("tuesday", "snack")}>Snack</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("tuesday", "lunch")}>Lunch</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("tuesday", "dinner")}>Dinner</MenuItem>
                                        </Menu>
                                        <Menu
                                            anchorEl = {this.state.dayAnchor}
                                            keepMounted
                                            open={this.state.anchorDay==="wednesday"}
                                            style = {{marginLeft: "114px"}}
                                            onClose={()=>this.closeMenu()}>
                                                <MenuItem onClick = {()=>this.addRecipe("wednesday", "breakfast")}>Breakfast</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("wednesday", "snack")}>Snack</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("wednesday", "lunch")}>Lunch</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("wednesday", "dinner")}>Dinner</MenuItem>
                                        </Menu>
                                        <Menu
                                            anchorEl = {this.state.dayAnchor}
                                            keepMounted
                                            open={this.state.anchorDay==="thursday"}
                                            style = {{marginLeft: "114px"}}
                                            onClose={()=>this.closeMenu()}>
                                                <MenuItem onClick = {()=>this.addRecipe("thursday", "breakfast")}>Breakfast</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("thursday", "snack")}>Snack</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("thursday", "lunch")}>Lunch</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("thursday", "dinner")}>Dinner</MenuItem>
                                        </Menu>
                                        <Menu
                                            anchorEl = {this.state.dayAnchor}
                                            keepMounted
                                            open={this.state.anchorDay==="friday"}
                                            style = {{marginLeft: "114px"}}
                                            onClose={()=>this.closeMenu()}>
                                                <MenuItem onClick = {()=>this.addRecipe( "friday", "breakfast")}>Breakfast</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("friday", "snack")}>Snack</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("friday", "lunch")}>Lunch</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("friday", "dinner")}>Dinner</MenuItem>
                                        </Menu>
                                        <Menu
                                            anchorEl = {this.state.dayAnchor}
                                            keepMounted
                                            open={this.state.anchorDay==="saturday"}
                                            style = {{marginLeft: "114px"}}
                                            onClose={()=>this.closeMenu()}>
                                                <MenuItem onClick = {()=>this.addRecipe("saturday", "breakfast")}>Breakfast</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("saturday", "snack")}>Snack</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("saturday", "lunch")}>Lunch</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("saturday", "dinner")}>Dinner</MenuItem>
                                        </Menu>
                                        <Menu
                                            anchorEl = {this.state.dayAnchor}
                                            keepMounted
                                            open={this.state.anchorDay==="sunday"}
                                            style = {{marginLeft: "114px"}}
                                            onClose={()=>this.closeMenu()}>
                                                <MenuItem onClick = {()=>this.addRecipe("sunday", "breakfast")}>Breakfast</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("sunday", "snack")}>Snack</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("sunday", "lunch")}>Lunch</MenuItem>
                                                <MenuItem onClick = {()=>this.addRecipe("sunday", "dinner")}>Dinner</MenuItem>
                                        </Menu>
                                        </div>
                                        );
                                })
                                }
                                
                            </List>
                        </Box>
                        <div>
                        <Grid container>
                                <Box border = {1} style = {classes.schedule}>
                                <List>
                                    <ListItem style = {classes.headers} >
                                        <ListItemText >Monday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.monday.breakfast}
                                    draggable = {this.state.monday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "monday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "mondaybreakfast")}>
                                        <ListItem>
                                            <Card style = {this.state.monday.breakfast != "Breakfast" ? classes.card : classes.blankSlot} raised = {this.state.monday.breakfast != "Breakfast" ? true : false }>
                                            {this.state.monday.breakfast != "Breakfast" ? 
                                                <div> 
                                                    <CloseIcon style = {classes.close} fontSize = "small"  onClick = {()=> this.resetSlot("monday", "breakfast")}></CloseIcon>
                                                    {this.findRecipe(this.state.monday.breakfast).name} ({this.findRecipe(this.state.monday.breakfast).calPerServing})
                                                </div> : 
                                                this.state.monday.breakfast}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.monday.snack}
                                    draggable = {this.state.monday.snack != "Snack" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "monday", "snack")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "mondaysnack")}>
                                        <ListItem>
                                            <Card style = {this.state.monday.snack != "Snack" ? classes.card : classes.blankSlot} raised = {this.state.monday.snack != "Snack" ? true : false }>
                                            {this.state.monday.snack != "Snack" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.monday.snack).name} ({this.findRecipe(this.state.monday.snack).calPerServing})
                                                    <CloseIcon fontSize = "4px"  onClick = {()=> this.resetSlot("monday", "snack")}></CloseIcon>
                                                </div> : 
                                                this.state.monday.snack}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.monday.lunch}
                                    draggable = {this.state.monday.lunch != "Lunch" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "monday", "lunch")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "mondaylunch")}>
                                        <ListItem>
                                            <Card style = {this.state.monday.lunch != "Lunch" ? classes.card : classes.blankSlot} raised = {this.state.monday.lunch != "Lunch" ? true : false }>
                                            {this.state.monday.lunch != "Lunch" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.monday.lunch).name} ({this.findRecipe(this.state.monday.lunch).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("monday", "lunch")}></CloseIcon>
                                                </div> : 
                                                this.state.monday.lunch}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.monday.dinner}
                                    draggable = {this.state.monday.dinner != "Dinner" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "monday", "dinner")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "mondaydinner")}>
                                        <ListItem>
                                            <Card style = {this.state.monday.dinner != "Dinner" ? classes.card : classes.blankSlot} raised = {this.state.monday.dinner != "Dinner" ? true : false }>
                                            {this.state.monday.dinner != "Dinner" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.monday.dinner).name} ({this.findRecipe(this.state.monday.dinner).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("monday", "dinner")}></CloseIcon>
                                                </div> : 
                                                this.state.monday.dinner}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <ListItem>
                                        <div>
                                            Calories: {this.calculateDailyCal("monday")} kCal
                                        </div>
                                    </ListItem>
                                </List>
                                </Box>
                                <Box border = {1}>
                                <List>
                                    <ListItem style = {classes.headers}>
                                        <ListItemText >Tuesday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.tuesday.breakfast}
                                    draggable = {this.state.tuesday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "tuesday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "tuesdaybreakfast")}>
                                        <ListItem>
                                            <Card style = {this.state.tuesday.breakfast != "Breakfast" ? classes.card : classes.blankSlot} raised = {this.state.tuesday.breakfast != "Breakfast" ? true : false }>
                                            {this.state.tuesday.breakfast != "Breakfast" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.tuesday.breakfast).name} ({this.findRecipe(this.state.tuesday.breakfast).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("tuesday", "breakfast")}></CloseIcon>
                                                </div> : 
                                                this.state.tuesday.breakfast}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.tuesday.snack}
                                    draggable = {this.state.tuesday.snack != "Snack" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "tuesday", "snack")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "tuesdaysnack")}>
                                        <ListItem>
                                        <Card style = {this.state.tuesday.snack != "Snack" ? classes.card : classes.blankSlot} raised = {this.state.tuesday.snack != "Snack" ? true : false }>
                                            {this.state.tuesday.snack != "Snack" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.tuesday.snack).name} ({this.findRecipe(this.state.tuesday.snack).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("tuesday", "snack")}></CloseIcon>
                                                </div> : 
                                                this.state.tuesday.snack}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.tuesday.lunch}
                                    draggable = {this.state.tuesday.lunch != "Lunch" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "tuesday", "lunch")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "tuesdaylunch")}>
                                        <ListItem>
                                        <Card style = {this.state.tuesday.lunch != "Lunch" ? classes.card : classes.blankSlot} raised = {this.state.tuesday.lunch != "Lunch" ? true : false }>
                                            {this.state.tuesday.lunch != "Lunch" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.tuesday.lunch).name} ({this.findRecipe(this.state.tuesday.lunch).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("tuesday", "lunch")}></CloseIcon>
                                                </div> : 
                                                this.state.tuesday.lunch}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.tuesday.dinner}
                                    draggable = {this.state.tuesday.dinner != "Dinner" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "tuesday", "dinner")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "tuesdaydinner")}>
                                        <ListItem>
                                            <Card style = {this.state.tuesday.dinner != "Dinner" ? classes.card : classes.blankSlot} raised = {this.state.tuesday.dinner != "Dinner" ? true : false }>
                                            {this.state.tuesday.dinner != "Dinner" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.tuesday.dinner).name} ({this.findRecipe(this.state.tuesday.dinner).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("tuesday", "dinner")}></CloseIcon>
                                                </div> : 
                                                this.state.tuesday.dinner}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <ListItem>
                                        <div>
                                            Calories: {this.calculateDailyCal("tuesday")} kCal
                                        </div>
                                    </ListItem>
                                </List>
                                </Box>
                                <Box border = {1}>
                                <List>
                                    <ListItem style = {classes.headers}>
                                        <ListItemText >Wednesday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.wednesday.breakfast}
                                    draggable = {this.state.wednesday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "wednesday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "wednesdaybreakfast")}>
                                        <ListItem>
                                            <Card style = {this.state.wednesday.breakfast != "Breakfast" ? classes.card : classes.blankSlot} raised = {this.state.wednesday.breakfast != "Breakfast" ? true : false }>
                                            {this.state.wednesday.breakfast != "Breakfast" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.wednesday.breakfast).name} ({this.findRecipe(this.state.wednesday.breakfast).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("wednesday", "breakfast")}></CloseIcon>
                                                </div> : 
                                                this.state.wednesday.breakfast}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.wednesday.snack}
                                    draggable = {this.state.wednesday.snack != "Snack" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "wednesday", "snack")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "wednesdaysnack")}>
                                        <ListItem>
                                        <Card style = {this.state.wednesday.snack != "Snack" ? classes.card : classes.blankSlot} raised = {this.state.wednesday.snack != "Snack" ? true : false }>
                                            {this.state.wednesday.snack != "Snack" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.wednesday.snack).name} ({this.findRecipe(this.state.wednesday.snack).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("wednesday", "snack")}></CloseIcon>
                                                </div> : 
                                                this.state.wednesday.snack}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.wednesday.lunch}
                                    draggable = {this.state.wednesday.lunch != "Lunch" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "wednesday", "lunch")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "wednesdaylunch")}>
                                        <ListItem>
                                            <Card style = {this.state.wednesday.lunch != "Lunch" ? classes.card : classes.blankSlot} raised = {this.state.wednesday.lunch != "Lunch" ? true : false }>
                                            {this.state.wednesday.lunch != "Lunch" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.wednesday.lunch).name} ({this.findRecipe(this.state.wednesday.lunch).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("wednesday", "lunch")}></CloseIcon>
                                                </div> : 
                                                this.state.wednesday.lunch}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.wednesday.dinner}
                                    draggable = {this.state.wednesday.dinner != "Dinner" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "wednesday", "dinner")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "wednesdaydinner")}>
                                        <ListItem>
                                            <Card style = {this.state.wednesday.dinner != "Dinner" ? classes.card : classes.blankSlot} raised = {this.state.wednesday.dinner != "Dinner" ? true : false }>
                                            {this.state.wednesday.dinner != "Dinner" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.wednesday.dinner).name} ({this.findRecipe(this.state.wednesday.dinner).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("wednesday", "dinner")}></CloseIcon>
                                                </div> : 
                                                this.state.wednesday.dinner}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <ListItem>
                                        <div>
                                            Calories: {this.calculateDailyCal("wednesday")} kCal
                                        </div>
                                    </ListItem>
                                </List>
                                </Box>
                                <Box border = {1}>
                                <List>
                                    <ListItem style = {classes.headers}>
                                        <ListItemText>Thursday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.thursday.breakfast}
                                    draggable = {this.state.thursday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "thursday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "thursdaybreakfast")}>
                                        <ListItem>
                                            <Card style = {this.state.thursday.breakfast != "Breakfast" ? classes.card : classes.blankSlot} raised = {this.state.thursday.breakfast != "Breakfast" ? true : false }>
                                            {this.state.thursday.breakfast != "Breakfast" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.thursday.breakfast).name} ({this.findRecipe(this.state.thursday.breakfast).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("thursday", "breakfast")}></CloseIcon>
                                                </div> : 
                                                this.state.thursday.breakfast}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.thursday.snack}
                                    draggable = {this.state.thursday.snack != "Snack" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "thursday", "snack")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "thursdaysnack")}>
                                        <ListItem>
                                            <Card style = {this.state.thursday.snack != "Snack" ? classes.card : classes.blankSlot} raised = {this.state.thursday.snack != "Snack" ? true : false }>
                                            {this.state.thursday.snack != "Snack" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.thursday.snack).name} ({this.findRecipe(this.state.thursday.snack).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("thursday", "snack")}></CloseIcon>
                                                </div> : 
                                                this.state.thursday.snack}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.thursday.lunch}
                                    draggable = {this.state.thursday.lunch != "Lunch" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "thursday", "lunch")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "thursdaylunch")}>
                                        <ListItem>
                                            <Card style = {this.state.thursday.lunch != "Lunch" ? classes.card : classes.blankSlot} raised = {this.state.thursday.lunch != "Lunch" ? true : false }>
                                            {this.state.thursday.lunch != "Lunch" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.thursday.lunch).name} ({this.findRecipe(this.state.thursday.lunch).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("thursday", "lunch")}></CloseIcon>
                                                </div> : 
                                                this.state.thursday.lunch}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.thursday.dinner}
                                    draggable = {this.state.thursday.dinner != "Dinner" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "thursday", "dinner")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "thursdaydinner")}>
                                        <ListItem>
                                            <Card style = {this.state.thursday.dinner != "Dinner" ? classes.card : classes.blankSlot} raised = {this.state.thursday.dinner != "Dinner" ? true : false }>
                                            {this.state.thursday.dinner != "Dinner" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.thursday.dinner).name} ({this.findRecipe(this.state.thursday.dinner).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("thursday", "dinner")}></CloseIcon>
                                                </div> : 
                                                this.state.thursday.dinner}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <ListItem>
                                        <div>
                                            Calories: {this.calculateDailyCal("thursday")} kCal
                                        </div>
                                    </ListItem>
                                </List>
                                </Box>
                                <Box border = {1}>
                                <List>
                                    <ListItem style = {classes.headers}>
                                        <ListItemText >Friday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.friday.breakfast}
                                    draggable = {this.state.friday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "friday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "fridaybreakfast")}>
                                        <ListItem>
                                        <   Card style = {this.state.friday.breakfast != "Breakfast" ? classes.card : classes.blankSlot} raised = {this.state.friday.breakfast != "Breakfast" ? true : false }>
                                            {this.state.friday.breakfast != "Breakfast" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.friday.breakfast).name} ({this.findRecipe(this.state.friday.breakfast).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("friday", "breakfast")}></CloseIcon>
                                                </div> : 
                                                this.state.friday.breakfast}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.friday.snack}
                                    draggable = {this.state.friday.snack != "Snack" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "friday", "snack")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "fridaysnack")}>
                                        <ListItem>
                                            <Card style = {this.state.friday.snack != "Snack" ? classes.card : classes.blankSlot} raised = {this.state.friday.snack != "Snack" ? true : false }>
                                            {this.state.friday.snack != "Snack" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.friday.snack).name} ({this.findRecipe(this.state.friday.snack).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("friday", "snack")}></CloseIcon>
                                                </div> : 
                                                this.state.friday.snack}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.friday.lunch}
                                    draggable = {this.state.friday.lunch != "Lunch" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "friday", "lunch")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "fridaylunch")}>
                                        <ListItem>
                                            <Card style = {this.state.friday.lunch != "Lunch" ? classes.card : classes.blankSlot} raised = {this.state.friday.lunch != "Lunch" ? true : false }>
                                            {this.state.friday.lunch != "Lunch" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.friday.lunch).name} ({this.findRecipe(this.state.friday.lunch).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("friday", "lunch")}></CloseIcon>
                                                </div> : 
                                                this.state.friday.lunch}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div
                                    id = {this.state.friday.dinner}
                                    draggable = {this.state.friday.dinner != "Dinner" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "friday", "dinner")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "fridaydinner")}>
                                        <ListItem>
                                            <Card style = {this.state.friday.dinner != "Dinner" ? classes.card : classes.blankSlot} raised = {this.state.friday.dinner != "Dinner" ? true : false }>
                                            {this.state.friday.dinner != "Dinner" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.friday.dinner).name} ({this.findRecipe(this.state.friday.dinner).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("friday", "dinner")}></CloseIcon>
                                                </div> : 
                                                this.state.friday.dinner}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <ListItem>
                                        <div>
                                            Calories: {this.calculateDailyCal("friday")} kCal
                                        </div>
                                    </ListItem>
                                </List>
                                </Box>
                                <Box border = {1}>
                                <List>
                                    <ListItem style = {classes.headers}>
                                        <ListItemText>Saturday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.saturday.breakfast}
                                    draggable = {this.state.saturday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "saturday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "saturdaybreakfast")}>
                                        <ListItem>
                                            <Card style = {this.state.saturday.breakfast != "Breakfast" ? classes.card : classes.blankSlot} raised = {this.state.saturday.breakfast != "Breakfast" ? true : false }>
                                            {this.state.saturday.breakfast != "Breakfast" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.saturday.breakfast).name} ({this.findRecipe(this.state.saturday.breakfast).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("saturday", "breakfast")}></CloseIcon>
                                                </div> : 
                                                this.state.saturday.breakfast}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.saturday.snack}
                                    draggable = {this.state.saturday.snack != "Snack" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "saturday", "snack")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "saturdaysnack")}>
                                        <ListItem>
                                        <Card style = {this.state.saturday.snack != "Snack" ? classes.card : classes.blankSlot} raised = {this.state.saturday.snack != "Snack" ? true : false }>
                                            {this.state.saturday.snack != "Snack" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.saturday.snack).name} ({this.findRecipe(this.state.saturday.snack).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("saturday", "snack")}></CloseIcon>
                                                </div> : 
                                                this.state.saturday.snack}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.saturday.lunch}
                                    draggable = {this.state.saturday.lunch != "Lunch" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "saturday", "lunch")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "saturdaylunch")}>
                                        <ListItem>
                                        <Card style = {this.state.saturday.lunch != "Lunch" ? classes.card : classes.blankSlot} raised = {this.state.saturday.lunch != "Lunch" ? true : false }>
                                            {this.state.saturday.lunch != "Lunch" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.saturday.lunch).name} ({this.findRecipe(this.state.saturday.lunch).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("saturday", "lunch")}></CloseIcon>
                                                </div> : 
                                                this.state.saturday.lunch}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.saturday.dinner}
                                    draggable = {this.state.saturday.dinner != "Dinner" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "saturday", "dinner")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "saturdaydinner")}>
                                        <ListItem>
                                            <Card style = {this.state.saturday.dinner != "Dinner" ? classes.card : classes.blankSlot} raised = {this.state.saturday.dinner != "Dinner" ? true : false }>
                                            {this.state.saturday.dinner != "Dinner" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.saturday.dinner).name} ({this.findRecipe(this.state.saturday.dinner).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("saturday", "dinner")}></CloseIcon>
                                                </div> : 
                                                this.state.saturday.dinner}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <ListItem>
                                        <div>
                                            Calories: {this.calculateDailyCal("saturday")} kCal
                                        </div>
                                    </ListItem>
                                </List>
                                </Box>
                                <Box border = {1}>
                                <List>
                                    <ListItem style = {classes.headers}>
                                        <ListItemText>Sunday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.sunday.breakfast}
                                    draggable = {this.state.sunday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "sunday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "sundaybreakfast")}>
                                        <ListItem>
                                            <Card style = {this.state.sunday.breakfast != "Breakfast" ? classes.card : classes.blankSlot} raised = {this.state.sunday.breakfast != "Breakfast" ? true : false }>
                                            {this.state.sunday.breakfast != "Breakfast" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.sunday.breakfast).name} ({this.findRecipe(this.state.sunday.breakfast).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("sunday", "breakfast")}></CloseIcon>
                                                </div> : 
                                                this.state.sunday.breakfast}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.sunday.snack}
                                    draggable = {this.state.sunday.snack != "Snack" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "sunday", "snack")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "sundaysnack")}>
                                        <ListItem>
                                            <Card style = {this.state.sunday.snack != "Snack" ? classes.card : classes.blankSlot} raised = {this.state.sunday.snack != "Snack" ? true : false }>
                                            {this.state.sunday.snack != "Snack" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.sunday.snack).name} ({this.findRecipe(this.state.sunday.snack).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("sunday", "snack")}></CloseIcon>
                                                </div> : 
                                                this.state.sunday.snack}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.sunday.lunch}
                                    draggable = {this.state.sunday.lunch != "Lunch" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "sunday", "lunch")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "sundaylunch")}>
                                        <ListItem>
                                            <Card style = {this.state.sunday.lunch != "Lunch" ? classes.card : classes.blankSlot} raised = {this.state.sunday.lunch != "Lunch" ? true : false }>
                                            {this.state.sunday.lunch != "Lunch" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.sunday.lunch).name} ({this.findRecipe(this.state.sunday.lunch).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("sunday", "lunch")}></CloseIcon>
                                                </div> : 
                                                this.state.sunday.lunch}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <div 
                                    id = {this.state.sunday.dinner}
                                    draggable = {this.state.sunday.dinner != "Dinner" ? "true": "false"} 
                                    onDragStart = {e => this.onDragRec(e, "sunday", "dinner")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "sundaydinner")}>
                                        <ListItem>
                                            <Card style = {this.state.sunday.dinner != "Dinner" ? classes.card : classes.blankSlot} raised = {this.state.sunday.dinner != "Dinner" ? true : false }>
                                            {this.state.sunday.dinner != "Dinner" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.sunday.dinner).name} ({this.findRecipe(this.state.sunday.dinner).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("sunday", "dinner")}></CloseIcon>
                                                </div> : 
                                                this.state.sunday.dinner}
                                            </Card>
                                        </ListItem>
                                    </div>
                                    <Divider/>
                                    <ListItem>
                                        <div>
                                            Calories: {this.calculateDailyCal("sunday")} kCal
                                        </div>
                                    </ListItem>
                                </List>
                                </Box>
                        </Grid>
                        </div>
                    </Grid>
                </div>
                <div>
                    <Button style = {classes.buttons} onClick ={()=>this.clearBasketAndSchedule()}>Clear Basket And Schedule</Button>
                </div>
                <div>
                    <Button style = {classes.buttons} onClick = {() => this.generateGroceryList()}>Generate Grocery List</Button>
                </div>
                {this.state.groceryList.length != 0 ?
                <div>
                    <Grid container >
                        <Box style = {classes.groceryList} border = {1}>
                            <List>
                                <ListItem style = {classes.headers}>
                                    <div>Ingredient</div>
                                </ListItem>
                                <Divider/>
                                {this.state.groceryList.map((ingredient,ind) => {
                                    return (
                                        <div
                                        key = {ind}>
                                            <ListItem>
                                                <div>
                                                    {ingredient.name}
                                                </div>
                                            </ListItem>
                                            <Divider/>
                                        </div>
                                    );
                                    })
                                }
                            </List>
                        </Box>
                        <Box style = {classes.groceryList} border = {1}>
                            <List>
                                <ListItem style = {classes.headers}>
                                    <div>Amount</div>
                                </ListItem>
                                <Divider/>
                                {this.state.groceryList.map((ingredient,ind) => {
                                    return (
                                        <div
                                        key = {ind}>
                                            <ListItem>
                                                <div>
                                                    {ingredient.amount}
                                                </div>
                                            </ListItem>
                                            <Divider/>
                                        </div>
                                    );
                                    })
                                }
                            </List>
                        </Box>
                        <Box border = {1}>
                            <List>
                                <ListItem style = {classes.headers}>
                                    <div>Unit</div>
                                </ListItem>
                                <Divider/>
                                {this.state.groceryList.map((ingredient,ind) => {
                                    return (
                                        <div
                                        key = {ind}>
                                            <ListItem>
                                                <div>
                                                    {ingredient.unit === "" ? "NA": <div>{ingredient.unit}</div>}
                                                </div>
                                            </ListItem>
                                            <Divider/>
                                        </div>
                                    );
                                    })
                                }
                            </List>
                            
                        </Box>
                    </Grid>
                </div> : <div> </div>}
            </div>
        );
    }
}
