const Joi = require('joi')
const common = require('../../models/common')
const { ObjectId } = require('mongodb')


const querySchema = Joi.object({
    id: Joi.string().max(24).min(24).description("optional field ,use this field to fetch todo by id"),
    status: Joi.string().valid("newTodo","Pending","Completed").description("optional field ,use this field to fetch todos by status"),
    skip: Joi.number().default(0).description('page skip').description("optional field ,use this field for pagination skip"),
    limit: Joi.number().default(100).description('page limit').description("optional field ,use this field for page limit"),
    sort : Joi.number().valid(-1,1).default(-1).description("optional field, for sorting todos by latest or oldest"),
    search: Joi.string().max(200).description('regex search by name and description')
})//joi validation

const handler = async (req, res) => {
    try {
        
        let mongoArguments = []

            mongoArguments.push({'$match': {

                ...(req.query.search && { "$or": [
                    { taskName: { '$regex': req.query.search, '$options': 'i' } },
                    { description: { '$regex': req.query.search, '$options': 'i' } }
                  ]}),
                  
                ...(req.query.id && { _id: new ObjectId(req.query.id) }),
                ...(req.query.status && { status: req.query.status })
            }})
            mongoArguments.push({'$sort':{"updatedOn": req.query.sort}})
            if(req.query.hasOwnProperty("skip"))mongoArguments.push({'$skip':req.query.skip})
            if(req.query.hasOwnProperty("limit"))mongoArguments.push({'$limit':req.query.limit})

        const result = await common.find(mongoArguments,"todos");
        
        console.log(result,"..........................<<res, args>>>",mongoArguments)
        
        return res.status(200).send({ message: "succesfully done", data: result });
    } catch (error) {
        throw error;
    }
}

module.exports = {
    handler,
    querySchema
};