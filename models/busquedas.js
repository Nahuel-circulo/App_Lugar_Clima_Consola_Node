const fs = require('fs');
const axios = require('axios');


class Busquedas {
    historial = [];
    dbPath = './database/database.json';
    constructor(){
        //TODO leer DB si existe
    }
    get paramsMapbox(){
        return {
            'access_token':process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    async ciudad( lugar = ''){

        try {

            const instance =  axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            })

            //peticion http

           const respuesta = await instance.get()

           return respuesta.data.features.map(lugar=>({
               id: lugar.id,
               nombre: lugar.place_name,
               lng: lugar.center[0],
               lat:lugar.center[1]
           }));
            
        } catch (error) {
            throw error
        }

    }

    get paramsWeather(){
        return {
            'appid':process.env.OPENWEATHER_KEY,
            'lang':'es',
            'units':'metric',
        }
    }

    async temperatura( lat,lon){

        
        try {

            const instance =  axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather?`,
                params: {...this.paramsWeather, lat,lon}
            })

            //peticion http

           const respuesta = await instance.get();
           
           const {weather,main} = respuesta.data;

           return {
               desc: weather[0].description,
               min: main.temp_min,
               max: main.temp_max,
               temp: main.temp
           }
            
        } catch (error) {
            console.log(error) 
        }

    }

    agregarHistorial(lugar=''){
        //prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,5); //solo mantiene 6 elementos en el arreglo

        this.historial.unshift(lugar) //unshift agrega al inicio del arreglo
        //llama al metodo de guardar en base de datos
        this.guardarBaseDeDatos();
    }

    guardarBaseDeDatos(){
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath,JSON.stringify(payload))
    }

    leerBaseDeDatos(){
        if(!fs.existsSync(this.dbPath)){
            return null
        }
        const info = fs.readFileSync(this.dbPath,{encoding:'utf-8'});
        const {historial} = JSON.parse(info);
        return historial;
    }
}


module.exports = Busquedas;