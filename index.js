const express = require('express')
const db = require('./db')
const app = express();
const user_limit = 5
const ip_limit = 20

app.get('/data', (req, res) => {
    
    const userId = req.headers['userid']
    const ip = req.ip

    const oneMinute = new Date(Date.now() - 60 * 1000)
    if (!userId) {
        return res.json('userId required')
    }
    const sqlQuery = 'select count(*) as total from rate_limit where userId = ? and createdAt >= ?'
    db.query(sqlQuery, [userId, oneMinute], (error, result) => {
        if (error) {
               
            return res.json('database error',error)
        }
        const userCount = result[0].total
        if (userCount >= user_limit) {
            return res.json('user rate limit exceed')
        }

        const ipSql = 'select count(*) as total from rate_limit where ip = ? and createdAt >= ?'
        db.query(ipSql, [ip, oneMinute], (err, ipresult) => {
            if (err) {
                 console.log("error",err)
                 return res.json('database error',err)
            
            }
            const ipCount = ipresult[0].total
            if (ipCount >= ip_limit) {
                return res.json('ip rate limit exceed')
            }
            
            const insertSql = 'Insert into rate_limit(userId,ip) values(?,?)';
            db.query(insertSql, [userId, ip])
            return res.json('data get')
        })
    })

})


app.listen(3000, () => {
    console.log('server run on port 3000')
})