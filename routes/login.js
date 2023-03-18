// const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const express = require('express');
const userModel = require('../models/User');
const app = express();

app.post("/add_user",async (request,response) => {
    const user = new userModel(request.body);
    response.json(user);
    return ;
    try {
        await user.save();
        response.send(user);
    } catch (error){
        response.status(500).send(error);
    }
});

module.exports = app;