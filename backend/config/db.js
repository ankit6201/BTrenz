const mongoose = require('mongoose')

const connectedDB = async()=>{
    try {
        const connec = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database Connected SuncessFull At : ${connec.connection.host}`);
        
    } catch (error) {
        console.log(error);
        process.exit(1)
        
    }
}

module.exports = connectedDB;