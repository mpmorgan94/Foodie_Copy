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
            groceryList: []
        }
    }
    componentDidMount()
    {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://api.spoonacular.com/recipes/informationBulk?ids=654959,654812,654857,654883,654926,654944,654905,654901,654913,654835&includeNutrition=true&apiKey=cfa46d82b3e84e2995601c31d209ae9c', true);
        request.send();
        request.onload = () =>  
        {

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
            if (recipe.id === id)
            {
                return recipe;
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
                copy.dinner = "Dinner;"

            }
            this.setState({monday: copy, currentDay: "", currentMeal: "" }, () => console.log(this.state));

        }
        else if(this.state.currentDay == "tuesday")
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
                copy.dinner = "Dinner;"

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
                copy.dinner = "Dinner;"

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
                copy.dinner = "Dinner;"

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
                copy.dinner = "Dinner;"

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
                copy.dinner = "Dinner;"

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
                copy.dinner = "Dinner;"

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

    generateGroceryList()
    {
        var copy = [];
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
        if(this.state.monday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.monday.dinner);
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
        if(this.state.tuesday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.tuesday.breakfast);
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
        if(this.state.tuesday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.tuesday.snack);
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
        if(this.state.tuesday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.tuesday.lunch);
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
        if(this.state.tuesday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.tuesday.dinner);
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
        if(this.state.wednesday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.wednesday.breakfast);
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
        if(this.state.wednesday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.wednesday.dinner);
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
        if(this.state.thursday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.thursday.breakfast);
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
        if(this.state.thursday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.thursday.snack);
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
        if(this.state.thursday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.thursday.lunch);
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
        if(this.state.thursday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.thursday.dinner);
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
        if(this.state.friday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.friday.breakfast);
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
        if(this.state.friday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.friday.snack);
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
        if(this.state.friday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.friday.lunch);
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
        if(this.state.friday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.friday.dinner);
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
        if(this.state.saturday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.saturday.breakfast);
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
        if(this.state.saturday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.saturday.snack);
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
        if(this.state.saturday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.saturday.lunch);
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
        if(this.state.saturday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.saturday.dinner);
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
        if(this.state.sunday.breakfast != "Breakfast")
        {
            var recipe = this.findRecipe(this.state.sunday.breakfast);
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
        if(this.state.sunday.snack != "Snack")
        {
            var recipe = this.findRecipe(this.state.sunday.snack);
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
        if(this.state.sunday.lunch != "Lunch")
        {
            var recipe = this.findRecipe(this.state.sunday.lunch);
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
        if(this.state.sunday.dinner != "Dinner")
        {
            var recipe = this.findRecipe(this.state.sunday.dinner);
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
        this.setState({groceryList: copy}, () => console.log(this.state));
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
        this.props.updateCurrentComponent(page);
    }

    render()
    {
        return(
            <div>
                <AppBar position="static">
                    <Toolbar>
                    <Button color = "inherit" onClick = {()=>this.goToPage("home")}>Home</Button>
                    <Button color = "inherit" onClick = {()=>this.goToPage("profile")}>Profile</Button>
                    <Button color = "inherit" onClick = {()=>this.goToPage("favorites")}>Favorites</Button>
                    
                    <Typography variant="h6">
                        Scheduler
                    </Typography>
                    </Toolbar>
                </AppBar>
                <div>
                    <Grid container>
                        <Box border = {1}>
                            <List>
                                <ListItem>
                                    <ListItemText>Basket</ListItemText>
                                </ListItem>
                                {this.state.basket.map((recipe,index) => {
                                    return (
                                        <div 
                                            id = {recipe.id}
                                            draggable = "true"
                                            onDragStart = {e => this.onDrag(e)}>
                                        <ListItem
                                        key = {index}>
                                            <ListItemText id = {index} primary = {recipe.name}/>
                                        </ListItem>
                                        </div>
                                        );
                                })
                                }
                                <Divider/>
                            </List>
                        </Box>
                        <div>
                        <Grid container>
                                <Box border = {1}>
                                <List>
                                    <ListItem>
                                        <ListItemText>Monday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.monday.breakfast}
                                    draggable = {this.state.monday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "monday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "mondaybreakfast")}>
                                        <ListItem>
                                            <Card variant = "outlined">
                                            {this.state.monday.breakfast != "Breakfast" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.monday.breakfast).name} ({this.findRecipe(this.state.monday.breakfast).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("monday", "breakfast")}></CloseIcon>
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
                                            <Card variant = "outlined">
                                            {this.state.monday.snack != "Snack" ? 
                                                <div> 
                                                    {this.findRecipe(this.state.monday.snack).name} ({this.findRecipe(this.state.monday.snack).calPerServing})
                                                    <CloseIcon fontSize = "small"  onClick = {()=> this.resetSlot("monday", "snack")}></CloseIcon>
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                    <ListItem>
                                        <ListItemText>Tuesday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.tuesday.breakfast}
                                    draggable = {this.state.tuesday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "tuesday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "tuesdaybreakfast")}>
                                        <ListItem>
                                            <Card variant = "outlined">
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
                                        <Card variant = "outlined">
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
                                        <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                    <ListItem>
                                        <ListItemText>Wednesday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.wednesday.breakfast}
                                    draggable = {this.state.wednesday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "wednesday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "wednesdaybreakfast")}>
                                        <ListItem>
                                            <Card variant = "outlined">
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
                                        <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                    <ListItem>
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                    <ListItem>
                                        <ListItemText>Friday</ListItemText>
                                    </ListItem>
                                    <Divider/>
                                    <div 
                                    id = {this.state.friday.breakfast}
                                    draggable = {this.state.friday.breakfast != "Breakfast" ? "true": "false"}
                                    onDragStart = {e => this.onDragRec(e, "friday", "breakfast")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop= {(e) => this.onDrop(e, "fridaybreakfast")}>
                                        <ListItem>
                                        <   Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                    <ListItem>
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
                                            <Card variant = "outlined">
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
                                        <Card variant = "outlined">
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
                                        <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                    <ListItem>
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                                            <Card variant = "outlined">
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
                    <Button onClick = {() => this.generateGroceryList()}>Generate Grocery List</Button>
                </div>
                {this.state.groceryList.length != 0 ?
                <div>
                    <Grid container >
                        <Box border = {1}>
                            <List>
                                <ListItem>
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
                        <Box border = {1}>
                            <List>
                                <ListItem>
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
                                <ListItem>
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
