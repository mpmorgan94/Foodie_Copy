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
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import Image from 'material-ui-image';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Drawer from '@material-ui/core/Drawer';

import DatabaseHandler from './DatabaseHandler.js';
import { FormatAlignJustify } from '@material-ui/icons';


export default class Home extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            favorites: [],
            basket: [],
            diet: "",
            allergies: [],
            recipes: [],
            news: [],
            action: "",
            actionOccured: false,
        }




    }


    async componentDidMount()
    {

        //get recipes from database
        await this.retreiveData();

        var stringRequest = 'https://api.spoonacular.com/recipes/complexSearch?';
        if(this.state.diet!== "")
        {
            stringRequest = stringRequest.concat("diet=");
            stringRequest = stringRequest.concat(this.state.diet);
            stringRequest = stringRequest.concat("&");
        }
        if(this.state.allergies.length !== 0)
        {
            stringRequest = stringRequest.concat("excludeIngredients=");
            let copyAllergy = this.state.allergies;
            for(var i=0; i<copyAllergy.length; i++)
            {
                if(i !== copyAllergy.length-1)
                {
                    stringRequest = stringRequest.concat(copyAllergy[i],",");
                }
                else
                {
                    stringRequest = stringRequest.concat(copyAllergy[i]);
                }
            }
            stringRequest = stringRequest.concat("&");
        }
        
        var stringAPIkey1 = "805e5c6f2aa0430f9339f0c977fe6a5e";
        var stringAPIkey2 = "776009e261104b10864e8a11347a4478";
        var stringAPIkey3 = "2e0b58c2c8eb4f10be5f5c02491158cb";
        var currentAPIkey = stringAPIkey1;
        stringRequest = stringRequest.concat("addRecipeNutrition=true&number=35&apiKey=" + currentAPIkey);
        console.log(stringRequest);

        var request = new XMLHttpRequest();
        request.open('GET', stringRequest, true);
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
                    recipe.id = result.id.toString();
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

                    recipe.image = result.image;
                    recipe.favorited = this.isFavorited(recipe);
                    recipe.inBasket = this.isInBasket(recipe);
                    var copy = this.state.recipes;
                    copy.push(recipe);
                    this.setState({recipes: copy}, () => console.log(this.state));
                }

                this.updateRecipies();

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
            if(recipe.id.toString() === current)
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
            if(recipe.id.toString() === current)
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
            if(recipe.id.toString() === current)
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
            if(recipe.id.toString() === current)
            {
                return i;
            }
        }
        return -1;
    }

    findIndexinRecipes(id)
    {
        if(this.state.recipes===[])
        {
            return -1;
        }
        for(var i =0; i< this.state.recipes.length; i++)
        {
            var current = this.state.recipes[i].id;
            if(id === current.toString())
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
            var actionString = "Removed ";
            actionString = actionString.concat(recipe.name);
            actionString = actionString.concat(" from Favorites");
            this.setState({favorites: copy, recipes: recipesCopy, actionOccured: true, action: actionString}, () => console.log(this.state));
        }
        else
        {
            recipe.favorited = true;
            var copy = this.state.favorites;
            copy.push(recipe.id.toString());
            var recipesCopy = this.state.recipes;
            recipesCopy[index].favorited = true;
            var actionString = "Added ";
            actionString = actionString.concat(recipe.name);
            actionString = actionString.concat(" to Favorites");
            this.setState({favorites: copy, recipes: recipesCopy, actionOccured: true, action: actionString}, () => console.log(this.state));
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
            var actionString = "Removed ";
            actionString = actionString.concat(recipe.name);
            actionString = actionString.concat(" from Basket");
            this.setState({basket: copy, recipes: recipesCopy, actionOccured: true, action: actionString}, () => console.log(this.state));
        }
        else
        {
            recipe.inBasket = true;
            var copy = this.state.basket;
            copy.push(recipe.id.toString());
            var recipesCopy = this.state.recipes;
            recipesCopy[index].inBasket = true;
            var actionString = "Added ";
            actionString = actionString.concat(recipe.name);
            actionString = actionString.concat(" to Basket");
            this.setState({basket: copy, recipes: recipesCopy, actionOccured: true, action: actionString}, () => console.log(this.state));
        }

    }

    updateRecipies()
    {
        var recipeCopy = this.state.recipes;
        for(var i = 0; i < this.state.basket.length; i++)
        {
            var index = this.findIndexinRecipes(this.state.basket[i]);
            if (index != -1) {
                recipeCopy[index].inBasket = true;
            }
        }
        for(var i = 0; i < this.state.favorites.length; i++)
        {
            var index = this.findIndexinRecipes(this.state.favorites[i]);
            if (index != -1) {
                recipeCopy[index].favorited = true;
            }
        }
        this.setState({recipes: recipeCopy}, () => console.log(this.state));
    }

    async retreiveData()
    {
        //get the array of favorite ids, and the array of basket ids
        // store them in the state with the call this.setState({basket: serverbasket, favorites: serverfavorites}, ()=>console.log(this.state))
        //the console.log will show you the current state in inspect. use that to ensure the data is being loaded correctly.
        //this will be called at the beginning of componentDidMount in final version but can be called using the corresponding button

        //Set initial diet
        let dh = "null";
        dh = await new DatabaseHandler("getUserDiet", this.props.username);
        if (dh != "null")
        {
            this.setState({diet: dh}, ()=>console.log(this.state));
        }

        //Set initial Allergies
        dh = [];
        dh = await new DatabaseHandler("getAllergies", this.props.username);
        if (dh.length != 0 && dh[0] != "null")
        {
            this.setState({allergies: dh}, ()=>console.log(this.state));
        }

        // get recipies string
        dh = "null";
        dh = await new DatabaseHandler("getRecipes", this.props.username);
        var basket_recipes_string = "";
        var favorites_recipes_string = "";
        var basket_recipes_array = [];
        var favorites_recipes_array = [];

        if (dh != "null")
        {
            if (dh != null && dh.length != 0 && dh != "null")
            {
                basket_recipes_string = dh.split('*')[0];
                favorites_recipes_string = dh.split('*')[1];
            }

            if (basket_recipes_string.length != 0)
            {
                basket_recipes_array = basket_recipes_string.split(',');
            }
            if (dh.split('*').length > 1 && favorites_recipes_string.length != 0)
            {
                favorites_recipes_array = favorites_recipes_string.split(',');
            }
        }
        
        if (basket_recipes_array.length != 0)
        {
            this.setState({basket: basket_recipes_array});
        }
        if (favorites_recipes_array.length != 0)
        {
            this.setState({favorites: favorites_recipes_array}, ()=>console.log(this.state));
        }
    }

    async storeData()
    {
        //store the state into the server; store the array of favorite ids and the array of basket ids
        // to get the array call this.state.favorites or this.state.basket
        //the array should show up using pgadmin or whatever you use to see the database
        //this will be called when clicking on the nav bar in the final version but can be called using the corresponding button
        //before storing the new basket and favorites, delete the old basket and favorites data corresponding to the username
        
        // make the recipe_id_string
        // "id,id,id,id,id,id,id,id*id,id,id,id,id,id,id"
        // ......basket_ids........^.....favorite_ids....

        // if empty string will be = "*"
        
        var recipe_id_string = "";
        var i;
        for (i = 0; i < this.state.basket.length; i++) {
            recipe_id_string = recipe_id_string + this.state.basket[i] + ",";
        }
        recipe_id_string = recipe_id_string.slice(0, -1);
        recipe_id_string = recipe_id_string + "*"
        i = 0;
        for (i = 0; i < this.state.favorites.length; i++) {
            recipe_id_string = recipe_id_string + this.state.favorites[i] + ",";
        }
        if (recipe_id_string.charAt(recipe_id_string.length - 1) == ",")
        {
            recipe_id_string = recipe_id_string.slice(0, -1);
        }
        console.log("recipe_id_string = " + recipe_id_string);

        let dh = false;
        dh = await new DatabaseHandler("saveRecipes", this.props.username, "null", "null", "null", recipe_id_string, "null");

    }

    async goToPage(page)
    {
        //save state to server here
        await this.storeData();
        this.props.updateCurrentComponent(page);
    }

    closeAlert()
    {
        this.setState({actionOccured: false}, ()=>console.log(this.state));
    }


    useStyles = {
        bar: {
            backgroundColor: "#0f0997"
        },
        buttons: {
            
            backgroundColor: "#0f0997",
            color: "#fcfcff",
            width: "140px",
            borderRadius: 5
            
        },
        gridContainer: {
            width: "100%"
        },
        grid:{
            width: "30%"
        },
        picture: {
            "borderRadius": "5px"
        },
        summary: {
            backgroundColor: "#d6dafc",
            width: "100%",
            border: "1px"
        },
        favorited: {
            color: "#d2345f",
            colorSecondary: "#d2345f",
            float: "right",
            borderWidth: "thin",
            FormatAlignJustify: "flex-end"
        },
        notFavorited: {
            color: "#74828b",
            borderWidth: "thin",
            float: "right",
        },
        accordion: {
            marginBottom: "5px"
        },
        news: {
            width: "200px",
            position: "absolute",
            borderWidth: "thin",
            borderRadius: "5px",
            marginLeft: "10px",
        },
        newsTitle: {
            fontSize: "15px",
            fontWeight: "bold"
        },
        calTitle: {
            fontWeight: "bold",
        },
        newsArticle: {
            fontSize: "12px",
        }
    };

    render()
    {
        var classes = this.useStyles;
        return(
            <div>
                <AppBar position="static" style = {classes.bar}>
                    <Toolbar>
                    <Typography style = {{marginLeft: "5px", marginRight: "7px"}} variant="h6">
                        Home
                    </Typography>
                    <Button color = "inherit" onClick = {()=>this.goToPage("profile")}>Profile</Button>
                    <Button color = "inherit" onClick = {()=>this.goToPage("favorites")}>Favorites</Button>
                    <Button color = "inherit" onClick = {()=>this.goToPage("scheduler")}>Scheduler</Button>
                    <Grid style = {{width: "90%"}} container justify="flex-end"><Button color = "inherit" onClick = {()=>this.goToPage("signin")}>Sign Out</Button></Grid>
                    </Toolbar>
                </AppBar>
                <div >
                    <Box style = {classes.news}>
                        <List>
                            <Paper>
                            <ListItem>
                                <Typography style ={classes.newsTitle}>Top Stories in Food</Typography>
                            </ListItem>
                            <Divider/>
                            {this.state.news.map((article,ind) => {
                                    return (
                                        <div style = {classes.newsArticle} key = {ind}>
                                            <div><a href = {article.url}>{article.title}</a></div>
                                            <div>{article.description}</div>
                                            <Divider/>
                                        </div>
                                    );
                                })
                            }
                            </Paper>
                        </List>
                    </Box>
                </div>
                <Container>
                <Snackbar 
                open={this.state.actionOccured} 
                message = {this.state.action}
                action={
                    <React.Fragment>
                      <IconButton size="small" aria-label="close" color="inherit" onClick={()=>this.closeAlert()}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </React.Fragment>}>
                </Snackbar>
                <List>
                    {this.state.recipes.map((recipe,index) => {
                        return (
                        <div
                        key = {index}>
                            <Accordion style = {classes.accordion}>
                                <AccordionSummary
                                style = {classes.summary}
                                expandIcon = {<div><ExpandMoreIcon/></div>}>
                                    <div style = {{width: "1200px"}}>
                                        {recipe.name}
                                        <FavoriteOutlinedIcon
                                    style = {this.state.recipes[index].favorited ? classes.favorited: classes.notFavorited}
                                    onClick = {() => this.favoriteRecipe(recipe, index)}></FavoriteOutlinedIcon>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div>
                                    <div>
                                        <span style = {classes.calTitle}>Calories:</span> {recipe.calories} {recipe.calUnit}
                                    </div>
                                    <div>
                                        <Grid style = {classes.gridContainer} container spacing = {2}>
                                            <Grid style = {classes.grid} item xs = {4}>
                                                <List>
                                                    <p>Ingredients</p>
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
                                                <p>Instructions</p>
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
                                                <Image style = {classes.picture} src={recipe.image} />
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div>
                                        <Button style ={classes.buttons} onClick = {() => this.addRemoveBasketItem(recipe,index)}>
                                            {this.state.recipes[index].inBasket ? "Remove From Basket": "Add To Basket"}
                                        </Button>
                                    </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        );
                    })
                }
                </List>
                </Container>
                
            </div>
        );
    }
}
