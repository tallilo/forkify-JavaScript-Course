import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    RESULT_PER_PAGE: RESULT_PER_PAGE,
  },
  bookmarks: [],
};

const creatRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = creatRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmark = true;
    else state.recipe.bookmark = false;
  } catch (err) {
    throw new Error(`sorry , we could not found the recipe ${err}`);
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.query = query;
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err('sorry , we could not found the  search results');
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  const start = (page - 1) * RESULT_PER_PAGE;
  const len = state.search.results.length;
  const lastResult = page * RESULT_PER_PAGE;
  const end = lastResult > len ? len : lastResult;
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * newServings) / state.recipe.servings)
  );
  state.recipe.servings = newServings;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  //Add bookmark;
  state.bookmarks.push(recipe);
  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmark = true;
  }
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  //Delete bookmark;
  state.bookmarks.splice(index, 1);

  //mark current recipe as Not bookmark
  if (id === state.recipe.id) {
    state.recipe.bookmark = false;
  }
  persistBookmarks();
};
const init = function () {
  const Storage = localStorage.getItem('bookmarks');
  if (Storage) state.bookmarks = JSON.parse(Storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(recipe => recipe[0].startsWith('ingredient') && recipe[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            `Wrong ingredient format! Please use the correct format :)`
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    console.log(ingredients);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = creatRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
//8d2b43b9-07b6-487d-b10e-a16cadd02c34
