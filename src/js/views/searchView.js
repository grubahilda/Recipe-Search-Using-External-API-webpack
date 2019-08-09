import { elements } from './base';

// getting input from the user (search box)
export const getInput = () => elements.searchInput.value; 

// emptying the search box text
export const clearInput = () => {
    elements.searchInput.value = '';
};

// emptying the results panel and the pagination panel
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const link = document.querySelectorAll(".results__link");
    link.forEach(el => el.classList.remove("results__link--active")); 
    document.querySelector(`.results__link[href="#${id}"]`).classList.add("results__link--active");
};

export const limitTitle = (title, limit = 17) => {
    
    let newTitle = [];
    
    if(title.length > limit) {

        // the returned value from reduce iteration is the new accumulator value
        title.replace(/[-\/]/g, " ").split(" ").reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);          
        return `${newTitle.join(" ")} ...`;
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// create prev or next button
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === "next" ? page + 1 : page - 1}>
    <span>Page ${type === "next" ? parseInt(page) + 1 : parseInt(page) - 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === "next" ? "right" : "left"}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    
    let button;
    if(page === 1 && pages > 1) {
        // Only next page button
        button = createButton(page, "next");
    } else if(page < pages) {
        // Both buttons
        button = `
            ${createButton(page, "next")}
            ${createButton(page, "prev")}
        `;
    } else if(page === pages && pages > 1) {
        // Only prev page button
        button = createButton(page, "prev");
    }

    elements.searchResPages.insertAdjacentHTML("afterbegin", button)
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage);
    
};