const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'secretkey'
var jwt = require('jsonwebtoken');
var fetchUser = require('../middleware/fetchUser')

router.post('/createUser',[
    body('name', 'Enter a valid name').isLength({min:5}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min: 5})
] ,async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try {   
        let user = await User.findOne({email: req.body.email})
        console.log(user)
        if (user){
            return res.status(400).json({success, error: "Sorry user with this email already exists"})
        } 
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success = true
        res.json({success, authToken})
    } catch(error) {
        console.error(error.message)
        res.status(500).send("Error Occured")
    }

})

router.post('/login',[
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').isLength({min: 5})
] ,async (req, res) => {
    let success = false
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body
    try{

        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success, error: "Wrong Credentials"})
        }
        const passCompare = await bcrypt.compare(password, user.password)
        if(!passCompare){
            return res.status(400).json({success, serror: "Wrong Credentials"}) 
        }

        const data = {
            user:{
                id: user.id
            }
        }
        success = true
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({success, authToken})
    }catch(error){
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})
router.post('/getUser',fetchUser ,async (req, res) => {

    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        console.log(user)
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal server error")
    }
})
module.exports = router