


const  Alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
   const BASE =Alphabet.length; 
//    console.log(BASE) 
function encode(num) {
     if(num==0) return Alphabet[0];
       let res = '';
     while(num>0){
        const char = Alphabet[num%62];
        res= char +res;
      num = Math.floor(num/62);
     }return res;
}
function decode(str) {
  let result =0;
   for(let i=0;i<str.length ;i++){
      const digit = Alphabet.indexOf(str[i]);
      result = result*62+digit;

   }
  return result;
}
console.log(encode(125)); // "21"
console.log(encode(1));   // "1"
console.log(encode(0));   // "0"
console.log(encode(3844)); // 3844 = 62*62, should be "100"
console.log(decode(encode(125)));
console.log(decode("21"));