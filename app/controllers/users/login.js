
const Joi = require('joi')
const common = require('../../models/common')
const jwtTokenGen = require("../../middlewares/jwt")

const bodySchema = Joi.object({
    emailOrPhone: Joi.string().required().description('email or phone number to find user for login'),
    password: Joi.string().required().description('a password for login')
})//object validation using joi


const handler = async (req, res) => {
    try {

        const result = await common.findOne({
            '$or':[
                {
                    email:req.body.emailOrPhone
                },
                {
                    phone_no:req.body.emailOrPhone
                }
            ]
        },"users");///mongodb call to find data

        console.log(result,"<><><><><><><><>...............<><><><><><><><><>")

        if(!result) return res.status(400).send({ message: "User Not Found"})

        if(!result.password==req.body.password) return res.status(400).send({ message: "Unable to login, Please make sure you are entering the right details"})

        const token = await jwtTokenGen.generateAccessToken(result)//generate token

        return res.status(200).send({ message: "Login Successful", token,userDetails:{
            name:result.name,
            profile_image: result.profile_image
        }});
    
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: "Internal server error"});
    }
}

module.exports = {
    handler,
    bodySchema
};