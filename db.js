require('dotenv').config();

const mysql = require('mysql');


const db = mysql.createConnection({
host : 'localhost',
user: "root",
password: process.env.password,
database:"rate_limit"
})
db.connect((err)=>{
    if(err) {
        console.log(err)
    }else{
        console.log('mysql connect')
    }
})

module.exports = db;