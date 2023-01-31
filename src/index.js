const express = require('express');
const app = express()
const port=3000;
const axios = require('axios');
const moment = require('moment');
// const os=require('os');
// const cluster = require('cluster');
// const { Worker } = require("worker_threads");

/*********************************************************************
 *       To get top 10 word - > order by word occurrences            *
 *********************************************************************/
app.get('/wordOccurence',async (req,res)=> {
   try {
    /** Create separate thread for this API  - */

    let results = await readFile();
    res.json(results)
   } catch (error) {
    res.sendStatus(500);
   }
})

async function readFile() {
   const { data } =  await axios.get(`http://norvig.com/big.txt`);
   const words = data.replace(/[^a-zA-Z ]/g, " ").split(" ").filter(Boolean);
 let results = {};
 for( let i = 0 ; i < words.length; i++ ) {
        let text = words[i].toLowerCase();
        if(results.hasOwnProperty(text)) {
            results[text] = results[text] + 1;
        } else {
             results[text] = 1;
        }
 }
 /*** Get top 10 word -> order by word occurrences */
 let resObj = {};
 Object.entries(results).sort((a,b)=>b[1]-a[1]).slice(0,10).forEach(e=>resObj[e[0]]=e[1] );
 return resObj;
}

/**********************************************************************
 *                 Get list of users                                  *
 **********************************************************************/
app.get("/users",async(req,res)=>{
    try{
      let users = await getUserList();
      res.json(users);
    }catch(err){
        console.log(err)
        res.sendStatus(500);
    }
})
/** Function to filter user's required information */
async function getUserList() {
    let { data } = await axios.get(`https://randomuser.me/api/?results=10`);
    let users = data.results.map(e=> {return { name : getName(e.name),DOB : moment(e.dob.date).format('YYYY-MM-DD'),email:e.email}})
    return users;
}
/********* To get names ******/
function getName(obj) {
    return obj.title + " " + obj.first + " " + obj.last
}





/**  Cluster implementation  */

// if(cluster.isMaster){
//  console.log(`Master is running on ${process.pid}`)
//  for(let i = 0 ; i < os.cpus().length;i++){
//     cluster.fork()
//  }
//  cluster.on('exit',()=>{
//     console.log("One worker destroyed!")
//     cluster.fork()
//  })
// } else {
//     app.listen(port,()=>{
//         console.log(`Server is running on port ${port}`);
//     })
// }



 app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })



