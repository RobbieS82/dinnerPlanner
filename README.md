# 🥘 Dinner Planner

Dinner Planner is a lightweight Node.js web app that helps you turn recipe data from a JSON file into an aggregated shopping list. Select your meals, click a button, and voilà—your shopping list is sorted, deduplicated, and ready to go.

## 📁 Features

- Read recipes from `./data/recipes.json`
- Interactive front-end with recipe checkboxes
- Aggregate ingredients from selected recipes
- Deduplicated and alphabetically sorted shopping list
- Simple and fast setup—no database required

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/RobbieS82/dinnerPlanner.git
```

### 2. Switch into the project directory

```bash 
cd dinnerPlanner
```

### 3. Install dependencies

```bash 
npm install
```

### 4. Launch

```bash 
node index.js
```

### Usage

The app will run, and you only have to open this link to view and use it: http://localhost:3000 

## Managing recipes

To add, delete, or modify meal plans, edit `./data/recipes.json`.

Each recipe should use this structure:

```json
{
  "name": "Recipe name",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "tags": ["Optional tag"],
  "source": "Optional URL or note"
}
```

The app reloads `/recipes` from disk on each page load, so saving changes to `./data/recipes.json` is enough for them to appear in the UI after a refresh.

### Ingredient quantities
If you need to specify an ingredient quantity, e.g. "six yellow onions", write it as "Yellow onion x6".  
This will ensure the ingredient aggregation works properly.