const { leerInput, inquirerMenu, inquirerContinue, listarLugares, } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require('dotenv').config()


const main = async () => {
    let opt;

    const busquedas = new Busquedas();
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //mostrar mensaje
                const lugar = await leerInput('Ciudad: ');
                //buscar lugares
                const lugares = await busquedas.ciudad(lugar)

                //seleccionar el lugar
                const id = await listarLugares(lugares)
                if (id === '0') {
                    continue //vuelve a la iteracion desde el comienzo
                }
                const lugarSelc = lugares.find(l => l.id === id)
                const temperatura = await busquedas.temperatura(lugarSelc.lat, lugarSelc.lng)
                //guarda en "base de datos"
                busquedas.agregarHistorial(lugarSelc.nombre)
                //mostrar datos del lugar
                console.clear();
                console.log('\nInformacion de la Ciudad\n');
                console.log(`Ciudad :${lugarSelc.nombre}`);
                console.log(`Latitud :${lugarSelc.lat}`);
                console.log(`Longitud :${lugarSelc.lng}`);
                console.log('Temperatura:', temperatura.temp);
                console.log('Minima:', temperatura.min);
                console.log('Maxima:', temperatura.max);
                console.log('Descripcion:', temperatura.desc);
                break;
                case 2:
                busquedas.historial = await busquedas.leerBaseDeDatos();

                busquedas.historial.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green
                    console.log(`${idx} ${lugar}`)
                })
                
                break;

            default:
                break;
        }

        if (opt !== 0) {
            await inquirerContinue();
        }

    } while (opt !== 0);


}

main();