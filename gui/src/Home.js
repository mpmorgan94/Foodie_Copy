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

export default class Home extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            favorites: [],
            basket: [],
            diet: "Vegan",
            allergies: ["egg", "shellfish"],
            recipes: []
        }
        var stringRequest = 'https://api.spoonacular.com/recipes/complexSearch?';
        stringRequest = stringRequest.concat("diet=");
        stringRequest = stringRequest.concat(this.state.diet);
        stringRequest = stringRequest.concat("&excludeIngredients=");
        let copyAllergy = this.state.allergies;
        for(var i=0; i<copyAllergy.length; i++)
        {
            if(i!=copyAllergy.length-1)
            {
                stringRequest = stringRequest.concat(copyAllergy[i],",");
            }
            else
            {
                stringRequest = stringRequest.concat(copyAllergy[i]);
            }
        }
        stringRequest = stringRequest.concat("&apiKey=2e0b58c2c8eb4f10be5f5c02491158cb");

        
    }

    componentDidMount()
    {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=2&addRecipeNutrition=true&apiKey=2e0b58c2c8eb4f10be5f5c02491158cb', true);
        request.send();
        request.onload = () =>  
        {

            // Begin accessing JSON data here
            var data = JSON.parse(request.response);
            if (request.status >= 200 && request.status < 400) {
                var length = Object.keys(data.results).length;

                for(var i = 0; i < length; i++)
                {
                    var result = data.results[i]; 
                    var recipe = new Object();
                    recipe.id = result.id;
                    recipe.name = result.title;
                    recipe.time = result.readyInMinutes;
                    var nutrients = result.nutrition["nutrients"];
                    recipe.calories = nutrients[0].amount;
                    recipe.calUnit = nutrients[0].unit;
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
                    var steps = result.analyzedInstructions[0].steps;
                    var stepLength = steps.length;
                    var instructions = [];
                    for(var k=0; k <stepLength; k++)
                    {
                        var instruction = steps[k].step;
                        instructions.push(instruction);
                    }
                    recipe.instructions = instructions;
                    recipe.picture = result.image;
                    var copy = this.state.recipes;
                    copy.push(recipe);
                    this.setState({recipes: copy}, () => console.log(this.state));
                }
            }
        }
    }

    render()
    {
        return(
            <div>
                <Container>
                    <h1>Home</h1>
                </Container>
            </div>
        );
    }
}
