import mongoose from "mongoose";
import { db_name } from "../constants.js";


const db_connect = async function(){
   try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${db_name}`);
        console.log(`Mongo db connected ${connectionInstance.connection.host}`);
   } catch (error) {
        console.log(`connection failed ${error}`);
          process.exit(1)
   }
}

export default db_connect;