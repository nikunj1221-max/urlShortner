
const { insertUrl , updateCode , findByCode} = require('../repository/urlRepository');
const { encode } = require('../utils/base62');
// const redisCLient = require('../db/redisClient'); // adjust the path to wherever your file actually lives
const redisClient = require('../db/redisClient');
async function shortenUrl(longUrl){
     const id = await insertUrl(longUrl);
        const code = encode(id);
        await  updateCode(id , code);
        return code;
}

  async function getLongUrl(code) {
       const longUrl = await  redisClient.get(code) 
       if(!longUrl){
         //  console.log("CACHE MISS — hitting DB");
          const newLongUrl = await findByCode(code);
        if(newLongUrl==null){
          console.log(" cant fetch url");
          return null;
            }  await redisClient.set(code,newLongUrl ,{ EX : 3600})
         return newLongUrl;
       }
      //   console.log("CACHE HIT — skipped DB"); 
         return longUrl;
        
      
    
  }
module.exports = { shortenUrl , getLongUrl};




