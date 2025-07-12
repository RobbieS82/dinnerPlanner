# 🥘 Dinner Planner

Dinner Planner is a lightweight Node.js web app that helps you convert recipe data from a CSV file into an aggregated shopping list. Select your meals, click a button, and voilà—your shopping list is sorted, deduplicated, and ready to go.

## 📁 Features

- Read recipes from `./data/recipes.csv`
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

## Adding recipes

To add meal plans, you only have to edit the CSV file found in ./data/recipes.csv. The first 
column is the nickname of the meal, and all other columns are the ingredients to add to the shopping list.

### Ingredient quantities
If you need to specify an ingredient quantity, e.g. "six yellow onions", write it as "Yellow onion x6".  
This will ensure the ingredient aggregation works properly.