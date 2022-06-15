const jwt = require('jsonwebtoken');
const common = require('../models/common');
const {ObjectId} = require('mongodb')
const resp = require('../../response.json')

const verifytoken = async (token)=> {
  return new Promise(function(resolve, reject) {
    jwt.verify(token,process.env.JWT_SECRET, function (err, res) {
      if (err) {
        reject(false);
      }      
      else {
        resolve(res);       
      }
    })
  })
}


exports.authenticateToken = async (req, res, next) => {
  
  const authHeader = req.headers['authorization']
  
  const token = authHeader && authHeader.split(' ')[1]

console.log(req.headers['authorization'],":::::::::::::::::::::<<<<<<<<<<<<<<<<<<<")

  if (token == null) return res.status(417).send(resp.token[417]); // if there isn't any token

  const response = await verifytoken(token).then(response=>{return response}).catch(err=>{return err})

  console.log(response,token)

  if(response){
    response.userId = new ObjectId(response.userId);

    let checkToken = await common.findOne({userId: response.userId,createdAt: new Date(response.createdAt)},'eventLog')

    console.log("............ooooooo...",checkToken)
    
    if(checkToken){

      req.user = response

      console.log("...............")
      return next()
    
    }else return res.status(417).send(resp.token[417])

  }else{
    return res.status(401).send(resp.token[401])
  }
} 
    

exports.generateAccessToken = async (user) => {
  const tokenData = {
    userId: user._id,
    userType: user.userType,
    createdAt: new Date()
  }
  
  tokenData.token = await jwt.sign(tokenData, process.env.JWT_SECRET)
  console.log(tokenData,"<><><<<<<<<<<<<<<<<<<<<,")
  
  common.insertOne(tokenData,"eventLog")// keeping token details in eventLog collection of DB, change setting of eventLog to remove data after a certain period of time to avoid old event logs
  return tokenData.token;
}
