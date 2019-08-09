
export default class Likes {
    constructor() {
        this.likes = [];
    }


    addLike(id, title, author, image) {
        
        const like = {
            id,
            title,
            author,
            image
        }
        this.likes.push(like);        

        // Persist data in localStorage
        this.persistData();

        return like;
    };

    deleteLike(id) {
        const index = this.likes.findIndex(elem => elem.id === id);
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    };

    isLiked(id) {
        return this.likes.includes(this.likes.find(el => el.id === id));
    };

    getNumLikes() {
        return this.likes.length;
    };

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    };

    readStorage() {
        const likesStorage = JSON.parse(localStorage.getItem('likes'));

        // Restore the data from the local storage
        if(likesStorage) this.likes = likesStorage; 
        
    }

};