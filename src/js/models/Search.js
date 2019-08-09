// Importing promis based HTTP client
import axios from "axios";
import { key, proxy } from "../config";

export default class Search {
  constructor(query) {
    this.query = query; // query is a input phrase from the user
  }

  // getting the results from food2fork using axios
  async getResults() {
    try {
      const res = await axios(
        `${proxy}https://www.food2fork.com/api/search?key=${key}&q=${
          this.query
        }`
      );
      this.result = res.data.recipes;
    } catch (error) {
      console.log(error);

      alert(error);
    }
  }
}
