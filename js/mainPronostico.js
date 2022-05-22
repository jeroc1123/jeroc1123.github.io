const API = "https://api.github.com/users/";
const WEATHER = "https://api.openweathermap.org/data/2.5/weather?APPID=6cbab6215c7af107c3c1331606080589&q=";
const WEATHER2 = "&lang=es&units=metric";

const app = Vue.createApp({
    data() {
        return {
            error: null,
            favorites: new Map(),
            countries: new Map(),
            resultPaises: {
                p: new Object
            },
            errorPaises: null,
            pais: null,
            localidad: null,
            pronostico: null,
            selected: "Selecciona País",

        };
    },
    created() {

    },
    computed: {

        // todosLosPaises(){

        //var { p } = this.resultPaises
        // let arr = {
        //     get: function (p, receiver) {
        //         return Reflect.get(...arguments)
        //     }
        // }

        // const prox = new Proxy(this.resultPaises, arr)
        // if (this.resultPaises.p.length > 0) {
        //     for (let pais of this.resultPaises.p) {
        //         //this.countries.set(parseInt(pais.countrycode), pais)
        //         this.countries.set(pais.countrycode, pais)
        //     }
        // }

        //     return this.countries;
        // },
    },
    methods: {
        cambiaPais() {
            this.pais = pais.value
        },
        async doSearch() {
            this.pronostico = this.error = null
            try {
                const url = WEATHER + this.localidad + ',' + this.pais + WEATHER2
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) throw new Error("Pronóstico no encontrado")
                const data = await response.json()
                this.pronostico = data
            } catch (error) {
                this.error = error
            } finally {
                this.localidad = null
                this.pais = null
                pais.value = "-1"
            }

            return this.pronostico
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
            window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites))
        },
    },
    mounted() {
        this.error = null
        axios.get("./js/countries.json")
            .then(response => {
                console.log("response.json " + response)
                this.resultPaises = response.data.p
                console.log("this.resultPaises " + this.resultPaises)
                if (this.resultPaises.length > 0) {
                    for (let pais of this.resultPaises) {
                        //this.countries.set(parseInt(pais.countrycode), pais)
                        this.countries.set(pais.countrycode, pais)
                    }
                }
            })
            .catch(error => { this.errorPaises = error })
            .finally(() => this.error = null)
    },
});
