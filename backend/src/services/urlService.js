
const { insertUrl , updateCode , findByCode} = require('../repository/urlRepository');
const { encode } = require('../utils/base62'); // adjust the path to wherever your file actually lives
async function shortenUrl(longUrl){
     const id = await insertUrl(longUrl);
        const code = encode(id);
        await  updateCode(id , code);
        return code;
}

  async function getLongUrl(code) {
     const longUrl = await findByCode(code);
     if(longUrl==null){
        console.log(" cant fetch url");
        return null;
     }return longUrl;
  }
module.exports = { shortenUrl , getLongUrl};




