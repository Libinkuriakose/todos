const {MongoClient} = require('mongodb');
const uri = process.env.MONGO_URL;
console.log(process.env.MONGO_URL,"mongo config<<<")
const client = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });
const state = {client:null}


exports.connect = async () => {
    
    try {
        // Connect to the MongoDB
        state.client = await client.connect();
        
 
    } catch (e) {
        console.error(e);
    }
}

//method for closing mongo connection
exports.close = async () => {
    await state.client.close()
    return true;
}

/**
 * Method to get the connection object of the mongodb
 * @returns db object
 */
exports.get = () => state.client.db();