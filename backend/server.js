if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// Packages
//const mongoose = require('mongoose') 
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const https = require('https')

const httpsOptions = {
    cert: fs.readFileSync('./certs/fullchain.pem'),
    passphrase: 'mait',
    key: fs.readFileSync('./certs/privkey.pem')
}

// express server 
const app = express()
const httpServer = https.createServer(httpsOptions, app)
app.use(bodyParser.json())
app.use(cors())


/*
// Mongo part
// Mongo DB data model through ODM
const UserM = mongoose.model('UserM', {
    name: String,
    email: String, 
    surname: String
})



// Test get API 
app.get('/', (req, res) => res.send('yada yada yada'))


// Mongo API endpoints
app.get('/users', async (req, res) => {
    const users = await UserM.find({}).limit(10)
    res.send(users)
})

app.post('/users', async (req, res) => {
    const user = await new UserM(req.body.user).save()
    res.send(user)
})
*/


// SQL part 

//Import API routes
const authRoute = require('./routes/auth')
const usersRoute = require('./routes/users')
const registrationRoute = require('./routes/registration')
const addRandomData = require('./routes/randomData')
const eventsRoute = require('./routes/events')
const reportingCases = require('./routes/reportingCases')
const mongoMigrate = require('./routes/mongoMigrate')




//Route Middleware
app.use('/api/user', authRoute)
app.use('/api/getAllUsers', usersRoute)
app.use('/api/registration', registrationRoute)
app.use('/randomData', addRandomData)
app.use('/events', eventsRoute)
app.use('/report', reportingCases)
app.use('/mongo', mongoMigrate)




const { sequelize } = require('./sequelize')
const { mongoose } = require('./mongooseSchemas/mongooseConnection')

// Run server
const run = async () => {
    let retriesMongo = 7;
    while (retriesMongo) {
        try {

            
            await mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            

            break; 
        } catch (err) {
            console.log(err)
            retriesMongo -= 1 
            console.log(`retries left for Mongo: ${retriesMongo}`)
            // try again in 5 seconds    
            await new Promise(res => setTimeout(res, 10000))
        }
    }
    
    let retriesPsg = 5;
    // let addRandomData = true

    while (retriesPsg) {
        try {
            await sequelize.authenticate();
            await sequelize.sync({ alter: true }) // generate tables
            break; 
        } catch (err) {
            console.log(err)
            retriesPsg -= 1 
            console.log(`retries left for psg: ${retriesPsg}`)
            // try again in 5 seconds    
            await new Promise(res => setTimeout(res, 10000))
        }
    }
    
    //await app.listen(process.env.PORT, () => {
    await httpServer.listen(process.env.PORT, () => { 
        console.log(`Assignment app listening on port ${process.env.PORT}!`)
    })
}

run()

