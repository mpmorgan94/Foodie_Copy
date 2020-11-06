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
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Image from 'material-ui-image';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';


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
            recipes: [],
            news: [],
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
        //https://api.spoonacular.com/recipes/informationBulk?ids=715538,716429&includeNutrition=true&apiKey=2e0b58c2c8eb4f10be5f5c02491158cb use to get recipes in favorites page and in scheduler
        var request = new XMLHttpRequest();
        request.open('GET', 'https://api.spoonacular.com/recipes/complexSearch?query=pasta&maxFat=25&number=25&addRecipeNutrition=true&apiKey=cfa46d82b3e84e2995601c31d209ae9c', true);
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
                    var instr = result.analyzedInstructions;
                    if(instr.length > 0)
                    {
                        var steps = result.analyzedInstructions[0].steps;
                        var stepLength = steps.length;
                        var instructions = [];
                        for(var k=0; k <stepLength; k++)
                        {
                            var instruction = steps[k].step;
                            instructions.push(instruction);
                        }
                        recipe.instructions = instructions;
                    }
                    else
                    {
                        var instructions = [];
                        instructions.push("No instructions available");
                        recipe.instructions = instructions;
                    }

                    recipe.picture = result.image;
                    recipe.favorited = this.isFavorited(recipe);
                    recipe.inBasket = this.isInBasket(recipe);
                    var copy = this.state.recipes;
                    copy.push(recipe);
                    this.setState({recipes: copy}, () => console.log(this.state));
                }
            }
        }

        var request2 = new XMLHttpRequest();
        request2.open('GET', 'https://gnews.io/api/v4/search?q=food&token=6e177d72311c57f9dbf9c307fe5fe8a4', true);
        request2.send();

        request2.onload = () =>  
        {

            // Begin accessing JSON data here
            var data = JSON.parse(request2.response);
            var articleList = [];
            if (request2.status >= 200 && request2.status < 400) {
                var length = Object.keys(data.articles).length;
                for(var i =0; i<length; i++)
                {
                    var article = data.articles[i];
                    if(!this.isInNews(article, articleList) && articleList.length <= 5)
                    {
                        var newsArticle = new Object();
                        newsArticle.title = article.title;
                        newsArticle.url = article.url;
                        newsArticle.description = article.description;
                        articleList.push(newsArticle);
                    }
                }
                this.setState({news: articleList}, () => console.log(this.state));
            }
        }
    }

    isInNews(article, articleList)
    {
        for(var i=0; i<articleList.length; i++)
        {
            if(article.title === articleList[i].title)
            {
                return true;
            }
        }
        return false;
    }

    isInBasket(recipe)
    {
        if(this.state.basket===[])
        {
            return false;
        }
        for(var i =0; i< this.state.basket.length; i++)
        {
            var current = this.state.basket[i];
            if(recipe.id === current)
            {
                return true;
            }
        }
        return false;
    }

    isFavorited(recipe)
    {
        if(this.state.favorites===[])
        {
            return false;
        }
        for(var i =0; i< this.state.favorites.length; i++)
        {
            var current = this.state.favorites[i];
            if(recipe.id === current)
            {
                return true;
            }
        }
        return false;
    }

    findIndexinFavorites(recipe)
    {
        if(this.state.favorites===[])
        {
            return -1;
        }
        for(var i =0; i< this.state.favorites.length; i++)
        {
            var current = this.state.favorites[i];
            if(recipe.id === current)
            {
                return i;
            }
        }
        return -1;

    }

    findIndexinBasket(recipe)
    {
        if(this.state.basket===[])
        {
            return -1;
        }
        for(var i =0; i< this.state.basket.length; i++)
        {
            var current = this.state.basket[i];
            if(recipe.id === current)
            {
                return i;
            }
        }
        return -1;
    }


    favoriteRecipe(recipe, index)
    {
        if(this.isFavorited(recipe))
        {
            var copy = this.state.favorites;
            var favIndex = this.findIndexinFavorites(recipe);
            copy.splice(favIndex,1);
            var recipesCopy = this.state.recipes;
            recipesCopy[index].favorited = false;
            this.setState({favorites: copy, recipes: recipesCopy}, () => console.log(this.state));
        }
        else
        {
            recipe.favorited = true;
            var copy = this.state.favorites;
            copy.push(recipe.id);
            var recipesCopy = this.state.recipes;
            recipesCopy[index].favorited = true;
            this.setState({favorites: copy, recipes: recipesCopy}, () => console.log(this.state));
        }
    }

    favoriteButtonColor(recipe)
    {
        if(this.isFavorited(recipe))
        {
            return "primary";
        }
        else
        {
            return "action";
        }
    }

    addRemoveBasketItem(recipe,index)
    {
        if(this.isInBasket(recipe))
        {
            var copy = this.state.basket;
            var basketIndex = this.findIndexinBasket(recipe);
            copy.splice(basketIndex,1);
            var recipesCopy = this.state.recipes;
            recipesCopy[index].inBasket = false;
            this.setState({basket: copy, recipes: recipesCopy}, () => console.log(this.state));
        }
        else
        {
            recipe.inBasket = true;
            var copy = this.state.basket;
            copy.push(recipe.id);
            var recipesCopy = this.state.recipes;
            recipesCopy[index].inBasket = true;
            this.setState({basket: copy, recipes: recipesCopy}, () => console.log(this.state));
        }

    }

    retreiveData()
    {
        //get the array of favorite ids, and the array of basket ids
        // store them in the state with the call this.setState({basket: serverbasket, favorites: serverfavorites}, ()=>console.log(this.state)) 
        //the console.log will show you the current state in inspect. use that to ensure the data is being loaded correctly.
        //this will be called at the beginning of componentDidMount in final version but can be called using the corresponding button
    }

    storeData()
    {
        //store the state into the server; store the array of favorite ids and the array of basket ids
        // to get the array call this.state.favorites or this.state.basket
        //the array should show up using pgadmin or whatever you use to see the database
        //this will be called when clicking on the nav bar in the final version but can be called using the corresponding button
        //before storing the new basket and favorites, delete the old basket and favorites data corresponding to the username
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
                    <Typography variant="h6">
                        Home
                    </Typography>
                    <Button color = "inherit" onClick = {()=>this.goToPage("profile")}>Profile</Button>
                    <Button color = "inherit" onClick = {()=>this.goToPage("favorites")}>Favorites</Button>
                    <Button color = "inherit" onClick = {()=>this.goToPage("scheduler")}>Scheduler</Button>
                    </Toolbar>
                </AppBar>
                <Container>
                <List>
                    {this.state.recipes.map((recipe,index) => {
                        return (
                        <div
                        key = {index}>
                            <Accordion>
                                <AccordionSummary
                                expandIcon = {<ExpandMoreIcon/>}>
                                    <div>
                                        {recipe.name}
                                    </div>
                                    <FavoriteIcon
                                    color = {this.state.recipes[index].favorited ? "primary": "action"}
                                    onClick = {() => this.favoriteRecipe(recipe, index)}></FavoriteIcon>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div>
                                        Calories: {recipe.calories} {recipe.calUnit}
                                    </div>
                                    <Grid container spacing = {2}>
                                        <Grid item xs = {4}>
                                            <List>
                                                {recipe.ingredients.map((ingredient,ind) => {
                                                    return (
                                                        <div
                                                        key = {ind}>
                                                            • {ingredient.name} {ingredient.amount} {ingredient.unit}
                                                        </div>
                                                    );
                                                    })
                                                }

                                            </List>

                                        </Grid>
                                        <Grid item xs = {4}>
                                        <List>
                                                {recipe.instructions.map((step,ind) => {
                                                    return (
                                                        <div
                                                        key = {ind}>
                                                            {ind+1}. {step}
                                                        </div>
                                                    );
                                                    })
                                                }
                                            </List>
                                        </Grid>
                                        <Grid item xs = {4}>
                                            <Image cache ={false} src={recipe.image} />
                                        </Grid>
                                    </Grid>
                                    <div>
                                            <Button onClick = {() => this.addRemoveBasketItem(recipe,index)}>
                                                {this.state.recipes[index].inBasket ? "Remove From Basket": "Add To Basket"}
                                            </Button>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        );
                    })
                }
                </List>
                </Container>
                <div>
                    <Box border = {1} style = {{width: "900px"}}>
                        <List>
                            <ListItem>
                                <h3>Top Stories in Food</h3>
                            </ListItem>
                            <Divider/>
                            {this.state.news.map((article,ind) => {
                                    return (
                                        <div key = {ind}>
                                            <div><a href = {article.url}>{article.title}</a></div>
                                            <div>{article.description}</div>
                                            <Divider/>
                                        </div>
                                    );
                                })
                            }
                        </List>
                    </Box>
                </div>
            </div>
        );
    }
}
