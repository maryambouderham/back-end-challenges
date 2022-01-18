const randomString = require('randomstring');
const { UserModel } = require("../models/user");
const bcryptjs = require("bcryptjs");
const { transport } = require("../mail/mailer");
const { validateData, validateDataRegister } = require("../validation/register");
const { respJson, error, sqlQuery } = require("../helpers/helpers");
const { db } = require("../config/mysql");
const randomstring = require('randomstring');
let QR = (sql) => new Promise((resolve, reject) => {

    db.query(sql, (err, res) => {
        if (err) reject(err)
        else { resolve(res) }
    })
  })
//register user
exports.register = async (httpReq, httpResp) => {

    //console.log(req.body)
    //new object
    const newUser=  new UserModel("aaa","bbb","maryam.bouderham@gmail.com","aaAA12345")
    // validate data
  
    
    // const patternPassword =
    //   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,12}$/;
  
    // if (!patternPassword.test(password)) {
    //   return resp.status(402).json({ message: 'Missing required email and password fields' })
      
    // }
  
    //   resp.send(
    //     "Password Should be at least 8 characters & maximum 12 and contains at least one number one uppercase and lowercase😅 !!"
    //   );
    //   return;
    // }
  
    // //validate username
    // let patternUsername = /^.{4,30}$/;
    // if (!patternUsername.test(UserName)) {
    //   resp.send("username should be at least 4 characters maximum 12");
    //   return;
    // }
    // //validate firstname
    // let patternFirstname = /^.{4,12}$/;
    // if (!patternFirstname.test(firstname)) {
    //   resp.send("firstname should be at least 4 characters maximum 12");
    //   return;
    // }
    // //validate lastname
    // let patternLastname = /^.{4,12}$/;
    // if (!patternLastname.test(lastname)) {
    //   resp.send("lastname should be at least 4 characters maximum 12");
    //   return;
    // }
    console.log(newUser)
    //verifier si username deja existe
    //Use then / catch 
  QR(`SELECT * FROM USERS 
  WHERE Email='${newUser.email}'`).then(s => console.log(s))
  QR(`SELECT * FROM USERS 
  WHERE Email='${newUser.email}'`).catch(e => console.log(e))
    
    try{
    let re= await QR(
      `SELECT * FROM USERS 
                WHERE 
                Email='${newUser.email}'`)
       
        
          if (re.length > 0 && re[0].isVerified == 1)
            //resp.send("username already exist ");
             //resp.status(402).json({ message: "username already exist "})
             console.log("username already exist" )
          else if (re.length > 0)
             //resp.status(403).json({ message: "Please Verify your account "})
              console.log("Please Verify your account")
             else {
            
              //INSERT sql query
              //INSERT INTO USERS (USERNAME,PASSWORD,FIRSTNAME,LASTNAME,AVATAR_URL)
              //VALUES('${newUser.username}',SHA1('${newUser.password}'),'${newUser.firstname}','${newUser.lastname}','${newUser.avatar_url}')
              //let query= INSERT INTO USERS SET ?
              
              // work with db
              try{
                let ne=await QR(`INSERT INTO USERS (Email,Password,Firstname,Lastname)
              VALUES ('${newUser.email}',SHA1('${newUser.password}'),'${newUser.firstname}','${newUser.lastname}')`)
              console.log(222)    
              console.log(ne);
                  //resp.send("Please Verify your email Account ...");
              }catch(error) {
                console.log(error.message)
                //resp.status(500).json({ message: error.message})
            }
                
              
            
            //generate token
            const secretToken = randomstring.generate();
            // INSERT TOKEN sql query
            let queryToken = ` UPDATE USERS set email_token='${secretToken}',isverified=0
              where Email='${newUser.email}' `;
            // work with db
            try{
            let updateQuery=await QR(queryToken);
          }catch(error) {
            console.log(error.message)
            //resp.status(500).json({ message: error.message})
        }
            //send mail to newUser's email account
            //mail options
            const mailOptions = {
              from: "fosen38858@videour.com",
              to: newUser.email,
              subject: "Please Verify your email Account",
              html: `<a href="http://localhost:9000/api/auth/${newUser.email}/code/${secretToken}">Verify My Email</a>`,
            };
            let info = await transport.sendMail(mailOptions);
            console.log(info)
            console.log("please verify your mail")
            //resp.status(201).json({ message: "please verify your mail "})
  
          }
          }catch(error) {
            console.log(error.message)
            //resp.status(500).json({ message: error.message})
        }};

exports.verifyEmail = async (httpReq, httpResp) => {

}

// //verify email after register
// exports.verifyEmail = async (httpReq, httpResp) => {

//     //fetch data 
//     let { email, token } = httpReq.params
//     //validate email and token 
//     try {
//         let res = await sqlQuery(`SELECT * FROM USERS WHERE email='${email}' AND email_token='${token}'`)
//         if (res.length == 0) httpResp.send(error("invalid email or token "))
//         else {
//             //verify expiration date 
//             let expirationDate = res[0].expirationDate
//             let currentDate = Date.now()
//             if (expirationDate < currentDate)
//                 httpResp.send(error("token has been expired"))
//             else {
//                 let userUpdated = await sqlQuery(`UPDATE USERS SET token='',isVerified=1 WHERE email='${email}'`)
//                 console.log(userUpdated);
//                 httpResp.
//                     send(`<h1>Your Account has been verified successfully </h1>
//                             <a href="http//localhost:3000/login">Login</a> `)
//             }
//         }

//     } catch (error) {
//         respJson(500, error.message, httpResp)
//     }

// }
exports.resend = (req, resp) => {
    //validate username
    let patternUsername = /^.{4,30}$/;
    if (!patternUsername.test(req.params.userEmail)) {
      resp.send("username should be at least 4 characters maximum 12");
      return;
    }
    //verifier si username deja existe
    db.query(
      `SELECT * FROM USERS 
                WHERE 
                Email='${req.params.userEmail}' `,
      (errr, resQ) => {
        if (errr) throw errr;
        else {
          console.log(resQ);
          if (resQ.length == 0) resp.send("username not found ");
          else {
            if (resQ.length > 0 && resQ[0].isverified == 1) {
              resp.send("username already verify ");
            } else {
              //generate token
              const secretToken = randomstring.generate();
              db.query(
                `UPDATE USERS SET expirationDate=NOW(), email_token='${secretToken}' WHERE Email='${req.params.userEmail}'`,
                (err, resQ1) => {
                  if (err) throw err;
                  else {
                    console.log(resQ1);
                    resp.send("please verify your mail");
                    //send mail to newUser's email account
                    //mail options
                    const mailOptions = {
                      from: "maryam.bouderham@gmail.com",
                      to: req.params.userEmail,
                      subject: "Please Verify your email Account",
                      html: `<a href="http://localhost:9000/api/auth/${req.params.userEmail}/code/${secretToken}">verify your mail</a>`,
                    };
                    transport.sendMail(mailOptions, (err1, info) => {
                      if (err1) throw err1;
                      else {
                        console.log(info);
                      }
                    });
                  }
                }
              );
            }
          }
        }
      }
    );
  };