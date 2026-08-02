const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
app.use(express.static('public'));

function readRecipes() {
  const recipesPath = path.join(__dirname, 'data', 'recipes.json');
  return JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
}

// Returns the latest recipe data from disk so JSON edits are reflected without restarting the server
app.get('/recipes', (req, res) => {
  try {
    res.json(readRecipes());
  } catch (error) {
    res.status(500).json({ error: 'Unable to load recipes.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});