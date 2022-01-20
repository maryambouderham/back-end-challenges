const { ChallengeModel } = require("../models/challenge")
const { db } = require("../config/mysql");
let QR = (sql) => new Promise((resolve, reject) => {

    db.query(sql, (err, res) => {
        if (err) reject(err)
        else { resolve(res) }
    })
  })
  //add challenge
exports.addChallenge= async (req,resp)=>{
    let newChallenge=new ChallengeModel("TITLE1","desc1","img")
    try{
        let ne=await QR(`INSERT INTO CHALLENGES (Title,Description,Image)
      VALUES ('${newChallenge.title}','${newChallenge.description}','${newChallenge.image}')`)
      console.log(222)    
      console.log(ne);
         
      }catch(error) {
        console.log(error.message)
        //resp.status(500).json({ message: error.message})
    }   
}
//edit challenge
exports.editChallenge= async (req,resp)=>{
    let newChallenge=new ChallengeModel("TITLEEDIT","desc1","img")
    try{
        let ne=await QR(`UPDATE CHALLENGES SET 
        Title='${newChallenge.title}',
        Description='${newChallenge.description}',
        Image='${newChallenge.image}'
        WHERE idChallenge=${req.params.challengeID}`)
      
      console.log(222)    
      console.log(ne);
         
      }catch(error) {
        console.log(error.message)
        //resp.status(500).json({ message: error.message})
    }   
    }