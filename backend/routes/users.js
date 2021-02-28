const router = require('express').Router()
const verify = require('./privateRoutes')
const { User } = require('../sequelize')


router.get('/',verify, async (req, res) => {
    try {
        const users = await User.findAll();
        //console.log(req.user)
        res.send(users)
    } catch (err) {
        console.log('Here1')
        console.log(err)
    }    
})


module.exports = router;


