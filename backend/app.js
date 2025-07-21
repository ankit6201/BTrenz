const express = require('express')
const cors = require('cors')
const app = express()



// Here I Am using buitltin Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))



//  Router
module.exports  = app;