
const { insertUrl , updateCode} = require('../repository/urlRepository');
const { encode } = require('../utils/base62'); // adjust the path to wherever your file actually lives
async function shortenUrl(longUrl){
     const id = await insertUrl(longUrl);
        const code = encode(id);
        await  updateCode(id , code);
        return code;
}


module.exports = { shortenUrl };




