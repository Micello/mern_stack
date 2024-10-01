require('dotenv').config()
const express = require('express')

//applicazione express
const app = express()

/*creiamo un middleware
app.use((req,res, next) => {
    console.log(req.path, req.method)
    next()
})
*/
app.get('/', (req, res) => {
    res.json({mssg: 'Benvenuto, questo messaggio è generato dalla funzione app.get'})
})

app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT)
})

//Per l'esecuzione automatica di server.js useremo nodemon, il quale rieseguira ogni volta che salviamo
//Per avviare nodemon server.js
//In realtà siccome abbiamo aggiunto dev in package.json posso usare "npm run dev"

//Installiamo dotenv per nascondere la porta

//Usiamo il sito postman per effettuare altre richieste http oltre alla get, senza il bisogno di scrivere un frontend.