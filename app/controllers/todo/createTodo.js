
const Joi = require('joi')
const common = require('../../models/common')

const bodySchema = Joi.object({
    taskName: Joi.string().required().description('full name of user'),
    description: Joi.string().description('A short description of task'),
    expiresIn: Joi.number().required().description('expiration time of task in seconds') 
})//object validation using joi


const handler = async (req, res) => {
    try {
        if(!req.user.userType=="admin") return res.status(400).send({ message: "Only admins can create todos"});

        const currentTime = +new Date(), expiresIn = (+new Date())+(req.body.expiresIn*1000)
        
        const result = await common.insertOne({

            taskName: req.body.taskName,
            ...(req.body.description && {description: req.body.description}),
            expiresIn,//converting to miliseconds and adding to timestamp for the expiration time in the future,
            expireDate : new Date (expiresIn),
            createdOn: currentTime,
            updatedOn: currentTime,
            completionStatus: "newTodo"/// initial status "newTodo", if one user plans to finish a task then change it's status to "pending " to let other users know someone is handling this task
        },"todos");///mongodb call to insert data

        return res.status(200).send({ message: "todo saved", data: result.ops[0]});
    
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: "Internal server error"});
    }
}

module.exports = {
    handler,
    bodySchema
};