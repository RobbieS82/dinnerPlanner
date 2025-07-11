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
    const ingredientSet = new Set();
    recipes.forEach(({ name, ingredients }) => {
      if (selectedRecipes.includes(name)) {
        ingredients.forEach((ing) => ingredientSet.add(ing));
      }
    });
    const sortedList = Array.from(ingredientSet).sort();
    res.json({ shoppingList: sortedList });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});