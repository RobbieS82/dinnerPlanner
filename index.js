const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
app.use(express.static('public'));
app.use(bodyParser.json());

const filePath = path.join(__dirname, 'data', 'recipes.csv');

function loadRecipes(callback) {
  const recipes = [];
  fs.createReadStream(filePath)
    .pipe(csv(["Name", "Ingredients"]))
    .on('data', row => {        
      
      // 
        const name = row["Name"].trim();

      const ingredients = Object.keys(row)
        .filter((key, index) => index > 0 && row[key])
        .map(key => row[key].trim());
      recipes.push({ name, ingredients });
    })
    .on('end', () => callback(recipes));
}

app.get('/recipes', (req, res) => {
  loadRecipes(recipes => res.json({ recipes }));
});

app.post('/shopping-list', (req, res) => {
  const selectedRecipes = req.body.selectedRecipes;
  loadRecipes((recipes) => {
    const ingredientMap = new Map();

    recipes.forEach(({ name, ingredients }) => {
      if (selectedRecipes.includes(name)) {
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

    res.json({ shoppingList: sortedList });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});