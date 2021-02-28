const router = require('express').Router()
const { User } = require('../sequelize')
const { Op } = require("sequelize")
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    // Validate
    const {error} = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Check if user already present
    const emailExists = await User.findAll({
        where: {
          email: {
            [Op.eq]: req.body.email
          }
        }
      });
    if(emailExists.length > 0) return res.status(400).send('Email already exsists')

    // Hashing
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    
    // Create a new user
    try {
        const response = await User.create({ email: req.body.email, password: hashPassword, role: req.body.role});
        res.send('User created')
    } catch (err) {
        res.status(400).send(err)
    }
})

// Login
router.post('/login', async (req, res) => {
    // Validate
    const {error} = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // Check if user already present
    const user = await User.findAll({
        where: {
          email: {
            [Op.eq]: req.body.email
          }
        }
      });
    if(user.length === 0) return res.status(400).send('Email does not exsist')

    console.log(user)

    //Password correct 
    const validPass = await bcrypt.compare(req.body.password, user[0].dataValues.password)
    if(!validPass) return res.status(400).send('Password is wrong')

    //Create and assign a token
    const token = jwt.sign({_id: user[0].dataValues.id}, "process.env.TOKEN_SECRET")
    res.header('auth-token', token).status(200).send(token)
    
})

module.exports = router
