const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(bodyParser.json());

// Recipes loaded from disk once at startup; imports update this in-memory copy only
let recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'recipes.json'), 'utf8'));

function getMealNames(recipes) {
  return recipes.map(recipe => recipe.name).sort();
}

// returns the recipe data
app.get('/recipes', (req, res) => {
  res.json(recipes);
});

// exports all recipes as a downloadable JSON file
app.get('/recipes/export', (req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="recipes.json"');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(recipes, null, 2));
});

// imports recipes from a JSON array, merging into the in-memory recipe list only (no disk write)
app.post('/recipes/import', (req, res) => {
  const imported = req.body;

  if (!Array.isArray(imported)) {
    return res.status(400).json({ error: 'Invalid format: expected an array of recipes' });
  }

  for (const recipe of imported) {
    if (typeof recipe.name !== 'string' || !recipe.name.trim()) {
      return res.status(400).json({ error: 'Invalid recipe: each recipe must have a non-empty name' });
    }
    if (!Array.isArray(recipe.ingredients)) {
      return res.status(400).json({ error: `Invalid recipe "${recipe.name}": ingredients must be an array` });
    }
  }

  // Normalise imported entries so all have the expected fields
  const normalised = imported.map(r => ({
    name: r.name.trim(),
    ingredients: r.ingredients,
    tags: Array.isArray(r.tags) ? r.tags : [],
    source: typeof r.source === 'string' ? r.source : ''
  }));

  // Merge: existing recipes updated or new ones added, keyed by name
  const recipeMap = new Map(recipes.map(r => [r.name, r]));
  normalised.forEach(r => recipeMap.set(r.name, r));
  recipes = Array.from(recipeMap.values());

  res.json({ success: true, total: recipes.length, imported: imported.length });
});

/**
 * A function that extracts all ingredients from the selected
 * recipes, normalizes them (lowercase, trimmed), aggregates quantities,
 * and returns a sorted list of ingredients.
 * @param {*} recipes
 */
app.post('/shopping-list', (req, res) => {
  const selectedRecipes = req.body.selectedRecipes;
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