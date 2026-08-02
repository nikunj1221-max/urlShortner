
const  express = require('express');
const router =express.Router();
const { rateLimiter } = require('../middleware/rateLimiter');
const{ shortenUrl, getLongUrl } = require('../services/urlService');
const { incrementClickCount } = require('../repository/urlRepository');

router.post('/shorten',rateLimiter,async ( req ,res) =>{
    try{
         if(!req.body.longUrl){
             return res.status(400).json({message:" bad request"})
         }
         const longUrl = req.body.longUrl;
         const code= await shortenUrl(longUrl);
         res.status(201).json({ shortUrl: `http://localhost:3000/${code}` });
    }
    catch(err){
     console.log(" err" ,err);
     
      console.log("err", err);
     res.status(500).json({ message: "something went wrong" });
    }
});

router.get('/:code' ,async  (req,res) =>{
    try{
       const code = req.params.code;
      const longUrl = await getLongUrl(code);
        if(longUrl==null){
           return  res.status(404).json({message:" no urlcode"})
        }
        incrementClickCount(code).catch(err => console.log("click tracking failed",err));
        
        res.redirect(302,longUrl);
    } catch (err){
      console.log(" err" ,err);
       console.log("err", err);
    res.status(500).json({ message: "something went wrong" });
   
    }
})

module.exports= router;
