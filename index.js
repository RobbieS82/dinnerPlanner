const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
app.use(express.static('public'));

// Recipes loaded from disk once at startup; served to the client for first-visit bootstrapping
const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'recipes.json'), 'utf8'));

// Returns the recipe data for client-side bootstrapping on first visit
app.get('/recipes', (req, res) => {
  res.json(recipes);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});