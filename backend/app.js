const express = require('express')
const cors = require('cors')
const app = express()
const authRouter = require('./routes/authRoutes')



// Here I Am using buitltin Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))



//  Router
app.use('/api/auth',authRouter);
module.exports  = app;