const API = "https://api.github.com/users/";

new Vue({
    el: "#app",
    data() {
        return {
            search: null,
            result: null,
            error: null,
            favorites: new Map(),
        };
    },
    created() {
        const savedFavorites = JSON.parse(window.localStorage.getItem("favorites"))
        if (savedFavorites.length) {
            const favorites = new Map(savedFavorites.map(favorite => [favorite.id, favorite]))
            this.favorites = favorites
        };
    },
    computed: {
        isFavorite() {
            return this.favorites.has(this.result.id)
        },
        allFavorites() {
            return Array.from(this.favorites.values())
        },
        parametrosTabla() {
            return {
                data: this.favorites,
                actionMode: "multiple",
                columnKeys: ["avatar_url", "name", "bio", "blog"],
            };
        },
    },
    methods: {
        async doSearch() {
            this.result = this.error = null
            try {
                const response = await fetch(API + this.search)
                if (!response.ok) throw new Error("Usuario no encontrado")
                const data = await response.json()
                this.result = data  
            } catch (error) {
                this.error = error
            } finally {
                this.search = null
            }
        },

        addFavorite() {
            this.favorites.set(this.result.id, this.result)
            this.updateStorage()
        },

        removeFavorite(favorite) {
            this.favorites.delete(this.result.id)
            this.updateStorage()
        },
        showFavorite(favorite){
            this.result = favorite
        },
        updateStorage() {
            window.localStorage.setItem('favorites',JSON.stringify(this.allFavorites))
        },
        handleAction(actionName, data) {
            console.log(actionName, data);
            window.alert("check out the console to see the logs");
        },
    }
});