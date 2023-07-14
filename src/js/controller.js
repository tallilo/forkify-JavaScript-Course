import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable'; // in order to sup old browzers
import 'regenerator-runtime/runtime'; // in order to sup old browzers
//const recipeContainer = document.querySelector('.recipe');

/* const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}; */

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpiner();
    // 1)loading recipy

    await model.loadRecipe(id);
    // 2)rendering the recipy

    //update result view to the current recipy
    resultsView.update(model.getSearchResultPage());
    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError(err);
    throw err;
  }
};
//controlRecipes();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpiner();
    const query = searchView.getQuery();
    /* if (!query) return; */
    await model.loadSearchResults(query);
    // render the searchResults

    resultsView.render(model.getSearchResultPage());

    //render the initial pagination

    paginationView.render(model.state.search);

    /*   paginationView.addHandlerRender(
      controlPaginationPrev,
      controlPaginationNext
    ); */

    // sent to the view the handlers function to handle click on pagination
  } catch (err) {
    //resultsView.renderError(err);
    throw err;
  }
};
/* const controlPaginationPrev = function () {
  model.state.search.page--;
  resultsView.render(model.getSearchResultPage());

  //render the initial pagination

  paginationView.render(model.state.search);

  paginationView.addHandlerRender(controlPaginationPrev, controlPaginationNext);
};
const controlPaginationNext = function () {
  model.state.search.page++;

  resultsView.render(model.getSearchResultPage());

  //render the initial pagination

  paginationView.render(model.state.search);

  paginationView.addHandlerRender(controlPaginationPrev, controlPaginationNext);
};
 */
const controlPagination = function (goToPage) {
  console.log(goToPage);
  model.state.search.page = goToPage;
  resultsView.render(model.getSearchResultPage());

  //render the initial pagination

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipy servings (in state)
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
  //update the recipe view
};
const controlAddBookmark = function () {
  //Add/Remove bookmark
  if (!model.state.recipe.bookmark) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) render the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlerBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //spiner in the loadding time
    addRecipeView.renderSpiner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipy
    recipeView.render(model.state.recipe);
    ///sucsess message
    addRecipeView.renderMessage('you sucssesfuly added the recipy!!!');
    ///render the bookmark view
    bookmarksView.render(model.state.bookmarks);
    // change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggelWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    //console.error('🚗', err);
    addRecipeView.renderError(err.message);
  }
};
const newFeature = function () {
  console.log('welcome to my first application');
};
const init = function () {
  bookmarksView.addHandlerRender(controlerBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
