import dotenv from 'dotenv';
import db_connect from './db/db_connect.js';
import { app } from './app.js';

dotenv.config(
    {path: './env'}
)

db_connect()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server running on port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

