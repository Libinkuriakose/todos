
const Joi = require('joi')
const common = require('../../models/common')

const bodySchema = Joi.object({
    name: Joi.string().required().description('full name of user'),
    profile_image: Joi.string().allow('',null).description('profile image string/key'),
    email: Joi.string().required().description('user email'),
    phone_no: Joi.string().max(10).min(10).required().description('user phone number'),
    password: Joi.string().required().description('a password for login in future'),
    userType: Joi.string().valid('admin','user').default('user').description('select user role,allowed values are admin and user')
})//object validation using joi


const handler = async (req, res) => {
    try {
        const currentTime = new Date()
        const data = [
            {
                '$or': [{email:req.body.email},{phone_no:req.body.phone_no}]
            },//find by email or phone number, if not found then insert user data in to DB
            
            {
                '$setOnInsert': {
                    ...req.body,
                    createdOn:currentTime,
                    updatedOn:currentTime,
                    status:'Active',
                    timestamp: +new Date()

                } //save data only when inserting
            },
            { upsert: true, returnDocument: 'after' }
        ]
        
        const result = await common.updateOne(data[0], data[1], data[2],"users");///mongodb call to insert data

        console.log(result,"<><><><><><><><>...............<><><><><><><><><>",result.value.createdOn)

        return res.status(200).send({ message: "user data saved successful", data: result.value});
    
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: "Internal server error"});
    }
}

module.exports = {
    handler,
    bodySchema
};