const mongoose =  require("mongoose")
const config = require("../config/default.json")
try{
    mongoose.connect(config.db)
}
catch(error){
    console.log(error)
}
const dbConnection =  mongoose.connection
dbConnection.on("error",(err)=>console.log(`Connection error {err}`))
dbConnection.once("open",()=>console.log("Connection Done"))