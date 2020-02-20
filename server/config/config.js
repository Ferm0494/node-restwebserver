process.env.PORT = process.env.PORT || 3000


//===============+Entorno+========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
    //===============================================

//========Base de datos===================



let urlDB
if (process.env.NODE_ENV === 'dev') {


    urlDB = 'mongodb://localhost:27017/cafe'

} else {

    urlDB = 'mongodb+srv://Ferm:cfjd0494@cluster0-qwl6r.mongodb.net/cafe'

}

process.env.urlDB = urlDB;

// process.env.urlDB = 'mongodb+srv://Ferm:cfjd0494@cluster0-qwl6r.mongodb.net/cafe'