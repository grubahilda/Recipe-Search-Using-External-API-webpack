import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */ 
const state = {};
// window.state = state;

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();    

    // 2) Create a new search object
    if(query) {
        // 3) New search object and add to state
        state.search = new Search(query);

        // 4) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);

        // 5) Search for recipes
        try {
            await state.search.getResults();     
    
            // 6) Render the results on UI
            clearLoader(elements.searchResult);
            searchView.renderResults(state.search.result);
            
        } catch (error) {
            alert("Error processing the search request.")
            clearLoader(elements.searchResult);
        }
    }
};

// Handling search button clicks
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // prevent page reloading after form submit
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const button = e.target.closest('.btn-inline');

    if(button) {
        const goToPage = parseInt(button.dataset.goto);        
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
    
    
});


/**
 * RECIPE CONTROLLER
 */
 const controlRecipe = async () => {
    const id = window.location.hash.replace("#", "");

    if(id) {        
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight the selected search item
        if(state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        // Get recipe data and parse ingredients
        try {
            await state.recipe.getRecipe();
            
            state.recipe.parseIngredients();
            
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render the results on the UI
            clearLoader();
            
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            console.log(error);
            
            alert("Error processing recipe.")
        }

        
    }
 };

 
 
 /**
  * LIST CONTROLLER
  */
 const controlList = () => {
     
    // Add a new list if there isn't any
    if(!state.list) state.list = new List();
    
    // Add each ingredient to the list
    state.recipe.ingredients.forEach(ingredient => {
        const item = state.list.addNewItem(
            ingredient.amount, ingredient.unit, ingredient.ingredient);
        listView.renderItem(item);
    });
    
    // Render the list of ingredients
};

//  window.addEventListener('hashchange', controlRecipe);
//  window.addEventListener('load', controlRecipe)

['hashchange', 'load'].forEach(event => window.addEventListener(
    event, controlRecipe));



// Handling list button clicks
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest(".shopping__item").dataset.itemid;

    // Handle the delete button
    if(e.target.matches(".shopping__delete, .shopping__delete *")) {
        state.list.deleteItem(id);
        
        // Remove from the UI
        listView.deleteItem(id);
        
        // Handle the update
    } else if(e.target.matches(".shopping__count--value")) {
        const value = parseFloat(e.target.value);
        state.list.updateAmount(id, value);
    }
});


/**
 * LIKES CONTROLLER
 */
const controlLikes = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // current recipe not yet liked
    if(!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID, state.recipe.title, state.recipe.author, state.recipe.image);
    
        // Toggle the button
        likesView.toggleLikeBtn(true);

        // Add like to the UI list
        likesView.renderLike(newLike);            

    // is liked
    } else {
        // Remove like to the state
        state.likes.deleteLike(currentID);

        // Toggle the button
        likesView.toggleLikeBtn(false);

        // Remove like from the UI list
        likesView.deleteLike(currentID);
        
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

};


// Restore local storage likes data on page load
window.addEventListener('load',  () => {
    state.likes = new Likes();

    // Restore likes from local storage
    state.likes.readStorage();

    // Show or hide like heart
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render liked recipes to the UI
    state.likes.likes.forEach(like => likesView.renderLike(like));

});


// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
   if(e.target.matches(".btn-decrease, .btn-decrease *")) {

       if(state.recipe.servings > 1) {
           state.recipe.updateServings('dec');
           recipeView.updateServingsIngredients(state.recipe);
       }
       
   } else if(e.target.matches(".btn-increase, .btn-increase *")) {
       state.recipe.updateServings('inc');
       recipeView.updateServingsIngredients(state.recipe);

   } else if(e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
       if(!state.list) controlList();

   } else if(e.target.matches(".recipe__love, .recipe__love *")) {
       controlLikes();
   }

   
});