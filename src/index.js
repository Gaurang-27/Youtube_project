import dotenv from 'dotenv';
// import db_connect from './db/db_connect.js';
import { app } from './app.js';
import mysql from "mysql2"

dotenv.config(
    {path: './env'}
)

const connection = mysql.createPool(
    {
        host : "127.0.0.1",
        user : "root",
        password : "1234",
        database : "videotube",
    }
).promise()

connection.getConnection()
.then(()=>{
    console.log("database connected succesfully")
    app.listen(8000,()=>{
        console.log("server running at port 8080")
    })
})
.catch((err)=>{
    console.log(err,"database failed to connect")
})
// db_connect()
// .then(()=>{
//     app.listen(process.env.PORT,()=>{
//         console.log(`server running on port ${process.env.PORT}`);
//     })
// })
// .catch((err) => {
//     console.log("MONGO db connection failed !!! ", err);
// })

export {connection};
