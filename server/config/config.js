process.env.PORT = process.env.PORT || 3000


//===============+Entorno+========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
    //===============================================

//=============+Config de JWT+===================

process.env.SEED = process.env.SEED || 'mi-secreto'
process.env.LIFE = '48h'



//====================


//=================Google================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1014301085314-5qh5r272k834388h130ngibg2nlhtd47.apps.googleusercontent.com'

//=======================================



//========Base de datos===================



let urlDB
if (process.env.NODE_ENV === 'dev') {

    //Nuestr base de datos se llama cafe 27017 es por defecto   
    urlDB = 'mongodb://localhost:27017/cafe'

} else {


    //process.env.MongoURI = heroku config:set "srv.../{user}:{pass}../{bd}"
    urlDB = process.env.MongoURI

}

process.env.urlDB = urlDB;

// process.env.urlDB = 'mongodb+srv://Ferm:cfjd0494@cluster0-qwl6r.mongodb.net/cafe'