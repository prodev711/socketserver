// const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const express = require('express');
const router = express.Router();
const service = require('./../services');

//********************* When user login ***************************/
router.get("/login/:email/:password", async(req,response) => {
    const {email, password} = req.params ;
    try{
        const states = await service.userService.loginUser({
            email : email,
            password : password
        });
        if ( states.length == 0 ){
           return response.status(502).json({
                message:"User not register"
           }) 
        } else {
            return response.json({
                message:"User has been created successfully",
                states
            })
        }
    } catch(err){
        return response.status(400).json({
            statusCode: 400,
            message : "Error : User not logined",
            error : "Bad Request"
        })
    }
    
});
/**********************When user Sign up  ************************************/
router.post("/login", async(req,response) => {
    const signupDTO = req.body ;
    const email = signupDTO.email ;
    try{
        const existUser = await service.userService.existUser(email);
        if ( existUser > 0 ) {
            return response.status(502).json({
                message:"Already exist"
            })
        }
    } catch(err){
        return response.status(400).json({
            message:"Server Error"
        })
    }
    try{
        const newUser = await service.userService.createUser(signupDTO);
        return response.json({
            message:"User has been created successfully",
            newUser
        })
    } catch(err){
        return response.status(400).json({
            message: "Error: User not created"
        })
    }
})

module.exports = router;