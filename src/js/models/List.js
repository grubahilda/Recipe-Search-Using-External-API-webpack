import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }


    addNewItem(amount, unit, ingredient) {
        
        const item = {
            id: uniqid(),
            amount,
            unit,
            ingredient
        }
        this.items.push(item);        
        return item;
    };

    deleteItem(id) {
        const index = this.items.findIndex(elem => elem.id === id);
        this.items.splice(index, 1);
    };

    updateAmount(id, newAmount) {
        this.items.find(el => el.id === id).amount = newAmount;
    }

};