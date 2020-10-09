const mongoose = require('mongoose')

const articleSchema = mongoose.Schema({
    title: String,
    content: String,
    urlToImage : String
})


const userSchema = mongoose.Schema({
    articles: [articleSchema],
    username: String,
    email: String,
    password: String,
    token: String,
    salt: String,
     
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel