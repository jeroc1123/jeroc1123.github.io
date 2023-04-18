const API = "https://api.github.com/users/";
const WEATHER = "https://api.openweathermap.org/data/2.5/weather?APPID=6cbab6215c7af107c3c1331606080589&q=";
const WEATHER2 = "&lang=es&units=metric";
const WEATHER4CITY1 = "https://api.openweathermap.org/data/2.5/forecast?q=";
const WEATHER4CITY2 = ",es&APPID=6cbab6215c7af107c3c1331606080589&lang=es&units=metric";

// Vue.component("data-table", DataTable);

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
            errorPronostico: null,
            pais: "-1",
            localidad: null,
            pronostico: null,
            selected: "Selecciona País",
            listaPrueba: [{ id: "1", nombre: "numero uno", edad: "18" },
            { id: "2", nombre: "numero dos", edad: "27" },
            { id: "3", nombre: "numero tres", edad: "36" },
            { id: "4", nombre: "numero cuatro", edad: "45" },
            { id: "5", nombre: "numero cinco", edad: "54" },
            { id: "6", nombre: "numero seis", edad: "63" },
            { id: "7", nombre: "numero siete", edad: "72" }],
            headers: ["dt", "temp", "temp min-max", "humedad", "descripcion", "viento"],
            listaPronostico: new Map(),
            resultListaPronostico: null,
            detalleCiudad: null,
        };
    },
    created() {


    },
    computed: {
        hayPronosticos() {
            return this.listaPronostico.size > 0;
        },
        noHayNada() {
            return this.listaPronostico.size == 0 && this.error == null && this.pronostico == null
        },
        parametrosTabla() {
            return {
                data: this.resultListaPronostico,
                actionMode: "multiple",
                columnKeys: ["dt_txt", "main.temp", "main.temp_min", "main.humidity", "weather[0].description"],
            };
        },
    },
    methods: {
        cambiaPais() {
            this.pais = pais.value
            this.localidad = null
        },
        inicializarVariables() {
            this.listaPronostico = new Map()
            this.resultListaPronostico = null
            this.pronostico = null
        },
        async doSearch() {
            this.listaPronostico = new Map()
            this.resultListaPronostico = null
            this.pronostico = null
            this.error = null

            if (this.pais != "-1") {
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
                    this.pais = "-1"
                    pais.value = "-1"
                }
                return this.pronostico
            } else {
                const url = WEATHER4CITY1 + this.localidad + WEATHER4CITY2
                console.log(url)

                await axios.get(url)
                    .then(response => {
                        this.resultListaPronostico = response.data.list
                        if (this.resultListaPronostico.length > 0) {
                            for (let p of this.resultListaPronostico) {
                                this.listaPronostico.set(p.dt, p)
                            }
                        }
                        this.detalleCiudad = response.data.city
                    })
                    .catch(error => {
                        console.log("error lista pronosticos: " + error)
                        this.error = error
                    })

                return this.listaPronostico
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
            window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites))
        },
        obtieneIcono(icon) {

            var icono 

            switch (icon) {
                case '01d':
                case '01n':
                    icono = "fa fa-solid fa-sun"
                    break
                case '02d':
                    icono = "fa fa-solid fa-cloud-sun"
                    break;
                case '03d':
                    icono = "fa fa-solid fa-cloud-meatball"
                    break;
                case '04d':
                    icono = "fa fa-solid fa-cloud"
                    break;
                case '09d':
                    icono = "fa fa-solid fa-cloud-showers-water"
                    break;
                case '10d':
                    icono = "fa fa-solid fa-cloud-rain"
                    break;
                case '11d':
                    icono = "fa fa-solid fa-cloud-bolt"
                    break;
                case '13d':
                    icono = "fa fa-solid fa-snowflake"
                    break;
                default:
                    icono = "fa fa-solid fa-smog"
                    break;

            }
            console.log(icon)
            return icono

        },
    },
    mounted() {
        // $('#dataTable').DataTable();
        // dataTable.DataTable();

        this.error = null
        axios.get("./js/countries.json")
            .then(response => {
                // console.log("response.json " + response)
                this.resultPaises = response.data.p
                // console.log("this.resultPaises " + this.resultPaises)
                if (this.resultPaises.length > 0) {
                    for (let pais of this.resultPaises) {
                        //this.countries.set(parseInt(pais.countrycode), pais)
                        this.countries.set(pais.countrycode, pais)
                    }
                }
            })
            .catch(error => { this.error = error })
    },
})