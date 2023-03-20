const Model = require("./../models");
const user = Model.User;

const loginUser = async(signinDTO) => {
    return await user.find(signinDTO);
}

const existUser = async(email) => {
    const logined = await user.find({email:email});
    return logined.length ;
}

const createUser = async(signupDTO) => {
    const newUser = await new user(signupDTO);
    return newUser.save() ;
}

module.exports = {
    loginUser,
    existUser,
    createUser
}