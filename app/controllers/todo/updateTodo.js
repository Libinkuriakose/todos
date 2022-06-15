
const Joi = require('joi')
const common = require('../../models/common')
const { ObjectId } = require('mongodb')

const bodySchema = Joi.object({
    id: Joi.string().max(24).min(24).required().description('mongoid of todo'),
    status: Joi.string().valid("Completed","Pending","impossible","delete").description('set status of todo')
})//object validation using joi


const handler = async (req, res) => {
    try {
        const currentTime = new Date()
        let result;

        if(req.body.status!="delete"){

        const data = [
            {
                _id : new ObjectId(req.body.id)
            },//find by id and change status
            
            {
                '$set': {
                    updatedOn:currentTime,
                    status: req.body.status,
                    updatedBy: new ObjectId(req.user.userId)
                } //data to change
            },
            { upsert: false, returnDocument: 'after' }
        ]
        
        result = await common.updateOne(data[0], data[1], data[2],"todos");///mongodb call to update data
        result = result.value
    }else{

        result = await common.deleteOne({_id: new ObjectId(req.body.id)},"todos")
        result = result.value
        console.log(result,"////////////")

    }

        console.log(result,"<><><><><><><><>...............<><><><><><><><><>")

        return res.status(200).send({ message: "todo data updated successfully", data: result});
    
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: "Internal server error"});
    }
}

module.exports = {
    handler,
    bodySchema
};