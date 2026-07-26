
const  express = require('express');
const router =express.Router();

const{ shortenUrl } = require('../services/urlService');

router.post('/shorten',async ( req ,res) =>{
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

module.exports= router;
