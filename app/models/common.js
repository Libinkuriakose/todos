const db = require('../../config/mongo');


const insert = async (body,tablename) => await db.get().collection(tablename).insertMany(body);

const updateOne = async (query,data,condition,tablename) => await db.get().collection(tablename).findOneAndUpdate(query,data,condition);

const updateMany = async (query,data,tablename) => await db.get().collection(tablename).updateMany(query,data);

const find = async (query,tablename) => await db.get().collection(tablename).aggregate(query).toArray();

const findOne = async (query,tablename) => await db.get().collection(tablename).findOne(query);

const insertOne = async (body,tablename) => await db.get().collection(tablename).insertOne(body);

const deleteOne = async (body,tablename) => await db.get().collection(tablename).findOneAndDelete(body);

const deleteMany = async (body,tablename) => await db.get().collection(tablename).deleteMany(body);

module.exports={
    insert,
    updateOne,
    findOne,
    find,
    insertOne,
    updateMany,
    deleteOne,
    deleteMany
}
