const redisClient = require("../db/redisClient");

 async function rateLimiter(req,res,next) {
      const redisKey = `ratelimit:${req.ip}`;
           const count =await  redisClient.incr(redisKey);
            if(count===1){await redisClient.expire(redisKey,60);}
            if(count>10) {
                return  res.status(429).json({ message: "something went wrong" });
                  

            }else{
                next();
            }
 }
 module.exports ={ rateLimiter};