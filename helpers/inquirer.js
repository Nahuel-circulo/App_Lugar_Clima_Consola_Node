const inquirer = require('inquirer');
require("colors");

const menuOpts = [
    {
        type: "list",
        name: "opcion",
        messega: "Que desea hacer?",
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'3.'.green} Salir`
            }
        ]

    }
]


const inquirerMenu = async () => {

    console.log("==========================".green);
    console.log("  Seleccione una opcion".yellow);
    console.log("==========================".green);
    const { opcion } = await inquirer.prompt(menuOpts)

    return opcion
}

const inquirerContinue = async () => {
    const continueMenu = [
        {
            type: "input",
            name: "enter",
            message: `Precione ${'Enter'.green} para continuar`,
        }
    ]
    
    const { opcion } = await inquirer.prompt(continueMenu)

    return opcion
}

const leerInput = async(message)=>{
    const question = [
        {
            type:'input',
            name:'desc',
            message,
            validate(value){
                if (value.length ===0){
                    return 'Por Favor ingrese un valor';
                }
                return true
            }
        }
    ];

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async (lugares = [])=>{
    const choices = lugares.map((lugar,i)=>{
        const idx = `${i +1}`.green

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    })
    choices.unshift({ //metodo para añadir una opcion a arreglo de opciones
        value:'0',
        name:'0.'.green + 'Cancelar'
    })
    const questions =[
        {
            type:'list',
            name:'id',
            message: 'Seleccione Lugar',
            choices

        }
    ]
    
    const  {id} = await inquirer.prompt(questions);
    return id;
}

const confirmar = async (message)=>{

    const question = [{

        type:'confirm',
        name:'ok',
        message
    }
    ]

    const {ok} = await inquirer.prompt(question);
    return ok;

}

const listadoCompletar = async (tareas = [])=>{
    const choices = tareas.map((tarea,i)=>{

        const idx = `${i +1}`.green
        
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked:(tarea.completadoEn) ? true : false
        }
    })

    const questions =[
        {
            type:'checkbox',
            name:'ids',
            message: 'Selecciones',
            choices

        }
    ]
    
    const  {ids} = await inquirer.prompt(questions);
    return ids;
}


module.exports = {
    inquirerMenu,
    inquirerContinue,
    leerInput,
    listarLugares,
    confirmar,
    listadoCompletar

}