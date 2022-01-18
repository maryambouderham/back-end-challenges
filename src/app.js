const express = require("express")
const { API_URL } = require("./config/api")
const { db } = require("./config/mysql")
const cors = require("cors")
const bp = require("body-parser")
const { register, verifyEmail, resend } = require("./api/auth")
const { verifyDate } = require("./helpers/verifyDate")
// const { verifyEmail,
//         register,
//     } = require("./api/auth")


//Connect
db.connect((err) => {
    if (err) throw err
    console.log("Mysql connected...")
})

const app = express()

//body could have diff types 
app.use(bp.urlencoded({ extended: true }))
//looks at requests where the Content-Type: application/json (Header)
app.use(bp.json())
//appliquer le cors comme middle ware 
app.use(cors())


app.listen('9000', () => {
    console.log('Server started on port 9000 😇');
})

// //register
 app.get(`/${API_URL.auth}/register`, register)
//resend mail
app.get(`/${API_URL.user}/:userEmail/resend`,resend)
// //verify email after register
app.get(`/${API_URL.auth}/:userEmail/code/:token`, (req, resp) => 
{
    //verify if account is already verify
    db.query(`select isverified,expirationDate from USERS where Email='${req.params.userEmail}'`, (err, resQ1) => {
      if(err) throw err
      else{ if(resQ1[0].isverified==0 && verifyDate(resQ1[0].expirationDate) ){
              //flag isVerified field as true 
             db.query(`UPDATE USERS SET isverified=1 , email_token='' WHERE Email='${req.params.userEmail}'`, (errr, resQ) => {
             if (errr) throw errr
             else {
            console.log(resQ)
            resp.send("<h1>Thank you for registering & verifying your email 😇 !!")
            } })}
            else {
                if(resQ1[0].isverified==1)    
                    resp.send("<h1>your account is already verify  !!")
                else
                resp.send(`"<h1>expire session !!<br/><a href="http://localhost:9000/api/users/${req.params.userEmail}/resend">Resend Mail</a>`)
                }
      }
    })
})
