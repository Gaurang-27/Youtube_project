import dotenv from 'dotenv';
// import db_connect from './db/db_connect.js';
import { app } from './app.js';
import mysql from "mysql2"

dotenv.config(
    {path: './env'}
)

const connection = mysql.createPool(
    {
        host : process.env.MYSQL_HOST,
        user : process.env.MYSQL_USER,
        password : process.env.MYSQL_PASSWORD,
        database : process.env.MYSQL_DATABASE,
        port : process.env.MYSQL_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0

    }
).promise()

connection.getConnection()
.then(()=>{
    console.log("database connected succesfully")
    app.listen(8000,()=>{
        console.log("server running at port 8000")
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
