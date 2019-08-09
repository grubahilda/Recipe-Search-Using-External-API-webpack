import axios from "axios";
import { key, proxy } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id; // each recipe has an id
  }

  async getRecipe() {
    try {
      const res = await axios(
        `${proxy}http://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.image = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
  }

  calcTime() {
    // Assuming that we need 10 minutes per 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 10;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const units = [...unitsShort, "kg", "g"];

    const newIngredients = this.ingredients.map(el => {
      // Uniform the units
      let ingredient = el.toLowerCase();

      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // Remove paranthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ").trim();

      // Parse ingredients into count, unit and ingredient

      const splitIngredient = ingredient.split(" ");
      const unitIndex = splitIngredient.findIndex(el2 => units.includes(el2));

      let ingredientObject;

      if (unitIndex === 0) {
        // There is no number but there is a unit
        ingredientObject = {
          amount: 1,
          unit: splitIngredient[unitIndex],
          ingredient
        };
      } else if (unitIndex > -1) {
        // Number and unit present
        const arrCount = splitIngredient.slice(0, unitIndex);

        let amount;
        if (arrCount.length === 1) {
          amount = eval(splitIngredient[0].replace("-", "+"));
        } else {
          amount = eval(splitIngredient.slice(0, unitIndex).join("+"));
        }

        ingredientObject = {
          amount,
          unit: splitIngredient[unitIndex],
          ingredient: splitIngredient.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(splitIngredient[0], 10)) {
        // Only number present, no unit
        ingredientObject = {
          amount: parseInt(splitIngredient[0], 10),
          unit: "",
          ingredient: splitIngredient.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        // No number and no unit
        ingredientObject = {
          amount: 1,
          unit: "",
          ingredient
        };
      }

      return ingredientObject;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // When servings are decreased
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    this.ingredients.forEach(ingredient => {
      ingredient.amount *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
