const cronJob = require('cron').CronJob
const common = require('../app/models/common')

const cronCheck = new cronJob('0 */1 * * * *', async () => {//<<<every 1 minutes
try{

  console.log("........executing cron job...........")

  const result = await common.find([
    
    {'$match': {

      expiresIn:{'$lte':+new Date()}
  
    }
    }
  ],"todos")
  
console.log(result,"........expired todos...........")


if(result.length>0){
  let ids=[]
  common.insert(result,"exTodos");///mongodb call to insert data

for(let i=0; i<result.length; i++){
  ids.push(result[i]._id)
}

console.log(ids,"........ids........")

common.deleteMany({'_id':{'$in':ids}},'todos')

}



}catch(err){
    console.log(err,"<<<<<<<<<======== err from todos cron job ")
}
},
null,
true,
'Asia/Kolkata'
);


module.exports={
  cronCheck
}
