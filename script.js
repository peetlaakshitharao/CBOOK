const searchBox = document.querySelector('.searchBox'); // Correct class
const searchbtn = document.querySelector('.searchbtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-closeBtn');

// Fetch recipes from API
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes....</h2>";
  const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
  const response = await data.json();
  recipeContainer.innerHTML = "";

  if (response.meals) {
    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');
      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea} Dish</p>
        <p>Belongs to ${meal.strCategory} Category</p>
      `;
      const button = document.createElement('button');
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      button.addEventListener('click', () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } else {
    recipeContainer.innerHTML = "<h2>No recipes found for that search!</h2>";
  }
}

// Fetch ingredients for a meal
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measurement = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measurement} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
}

// Open the recipe pop-up with details
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientsList">${fetchIngredients(meal)}</ul>
    <div class="recipeInstructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
  `;
  recipeDetailsContent.parentElement.style.display = "block";
}

// Close the recipe details pop-up
recipeCloseBtn.addEventListener('click', () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

// Search button functionality
searchbtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = "<h2>Type a meal name in the search box!</h2>";
    return;
  }
  fetchRecipes(searchInput);
});
