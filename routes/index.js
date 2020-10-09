var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var SHA256 = require('crypto-js/sha256')
var encBase64 = require('crypto-js/enc-base64')

var userModel = require('../models/users')
// var articlesModel = require('../models/articles')


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var salt = uid2(32)
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: SHA256(req.body.passwordFromFront+salt).toString(encBase64),
      token: uid2(32),
      salt: salt,
    })
    // newUser.articles.push({
    //   title: "test",
    //   content:"test",
    //   urlToImage: "test"})
    saveUser = await newUser.save()
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      const passwordEncrypt = SHA256(req.body.passwordFromFront + user.salt).toString(encBase64)

      if(passwordEncrypt == user.password){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

router.post('/addArticle', async function(req,res,next){

  console.log("token:",req.body.token);

  var users = await userModel.findOne(
    { token: req.body.token }
 )
console.log("log avant le push",users);
    users.articles.push({
      title: req.body.myarticletitles,
      content:req.body.myarticlecontent,
      urlToImage: req.body.myarticleimg})

      saveUser = await users.save()
      console.log("log apres le push", users);
 res.json({users})
 
})

router.post('/deleteArticle', async function(req,res,next){

  console.log("token:",req.body.token);

  var users = await userModel.findOne(
    { token: req.body.token }
 )
  if (users.articles.length > 0){
    for (var i = 0; i < users.articles.length; i++){
      users.articles.splice(i,1);
      saveUser = await users.save()
    }
    res.json({articles :users.articles})
  }else{
    res.json()
  }  
    

 
 
})

module.exports = router;
