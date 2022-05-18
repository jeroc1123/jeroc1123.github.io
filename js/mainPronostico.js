const API = "https://api.github.com/users/";

const app = Vue.createApp({
    data() {
        return {
            error: null,
            favorites: new Map(),
            countries: new Map(),
            resultPaises: null,
            errorPaises: null,
            pais: null,
            localidad: null,
        };
    },
    created() {
        const savedFavorites = JSON.parse(window.localStorage.getItem("favorites"))
        if (savedFavorites.length) {
            const favorites = new Map(savedFavorites.map(favorite => [favorite.id, favorite]))
            this.favorites = favorites
        };

        const response = fetch("./js/countries.json")
                        .then(response => response.json())
                        .then(result => this.resultPaises = result);
        for (p in this.resultPaises) {
            this.countries.set(p.country-code, p);
        }
    },
    computed: {
        isFavorite() {
            return this.favorites.has(this.result.id)
        },
        allFavorites() {
            return Array.from(this.favorites.values())
        },
        allPaises() {
            return this.resultPaises.paises
        }
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

        removeFavorite() {
            this.favorites.delete(this.result.id)
            this.updateStorage()
        },
        updateStorage() {
            window.localStorage.setItem('favorites',JSON.stringify(this.allFavorites))
        },
    }
});