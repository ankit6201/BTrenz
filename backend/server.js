const app = require('./app')
require('dotenv').config()
const connectedDB = require('./config/db.js')
connectedDB()


const PORT = process.env.PORT || 8000

app.listen(PORT , ()=>{
   console.log(`The Serever Run On ${PORT}`);
   
})

