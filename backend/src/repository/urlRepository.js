
const pool = require('../db/pool');

async function insertUrl(longUrl) {
      
    const result = await pool.query( ' INSERT INTO short_urls (long_url ) VALUES ($1) RETURNING id' , [ longUrl]);
     
      return result.rows[0].id;
} //What it does conceptually: creates a brand new row in your short_urls table, but at this point you only have the long URL — you don't have a code yet, because remember, code is generated from the row's id, and you don't have an id until the row actually exists. So this function's whole job is: "create the row, hand me back the id Postgres just generated for it."


async function updateCode(id,code){
   
  await pool.query('UPDATE short_urls SET code = $1 WHERE id = $2', [code ,id]);
           }

module.exports= { insertUrl, updateCode}