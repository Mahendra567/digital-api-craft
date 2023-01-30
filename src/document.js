const { parentPort } = require('worker_threads');

async function readFile() {
    const { data } =  await axios.get(`http://norvig.com/big.txt`);
    const words = data.replace(/[^a-zA-Z ]/g, " ").split(" ").filter(Boolean);
      //const uniquWords = Array.from(new Set(words));
  let results = {};
  for( let i = 0 ; i < words.length; i++ ) {
         let text = words[i].toLowerCase();
         if(results.hasOwnProperty(text)) {
             results[text] = results[text] + 1;
         } else {
              results[text] = 1;
         }
  }
  /*** Get top 10 word -> order by word occurences */
  let resObj = {};
  Object.entries(results).sort((a,b)=>b[1]-a[1]).slice(0,10).forEach(e=>resObj[e[0]]=e[1] );
  parentPort.postMessage(resObj)
 }

 

