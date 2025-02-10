import dotenv from 'dotenv';
import db_connect from './db/db_connect.js';

dotenv.config(
    {path: './env'}
)

db_connect();
