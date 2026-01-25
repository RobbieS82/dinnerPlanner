const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(bodyParser.json());


function getData() {
  const filePath = path.join(__dirname, 'data', 'recipes.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return data;
}

function getMealNames(recipes) {
  return recipes.map(recipe => recipe.name).sort();
}

// returns the receipe JSON data
app.get('/recipes', (req, res) => {
  const data = getData();
  res.json(
    JSON.parse(data)
  );
});

/**
 * A function that extracts all ingredients from the selected
 * recipes, normalizes them (lowercase, trimmed), aggregates quantities,
 * and returns a sorted list of ingredients.
 * @param {*} recipes
 */
app.post('/shopping-list', (req, res) => {
  const selectedRecipes = req.body.selectedRecipes;
  const recipes = JSON.parse(getData());
  const ingredientMap = new Map();
  const selectedMeals = [];
  const mealIngredients = {}; // map meal name -> array of its raw ingredients

  recipes.forEach(({ name, ingredients }) => {
    if (selectedRecipes.includes(name)) {
      selectedMeals.push(name); // Collect selected meal names
      // keep raw ingredients per-meal for UI grouping
      mealIngredients[name] = Array.isArray(ingredients) ? [...ingredients] : [];
      ingredients.forEach((raw) => {
        const match = raw.match(/^(.*?)(?:\s*x(\d+))?$/i);
        const item = match[1].trim().toLowerCase();
        const qty = match[2] ? parseInt(match[2], 10) : 1;

        if (ingredientMap.has(item)) {
          ingredientMap.set(item, ingredientMap.get(item) + qty);
        } else {
          ingredientMap.set(item, qty);
        }
      });
    }
  });

  const sortedList = Array.from(ingredientMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([item, qty]) => `${item} x${qty}`);

  res.json({
    selectedMeals: selectedMeals.sort(), // Alphabetical list of meals
    shoppingList: sortedList,
    mealIngredients
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});