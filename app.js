//jshint esversion:6
require('dotenv').config(); //here we are not storing it in any constant as we just want to require it and using it on the top coz we need the configuration beforre anything
const express = require("express");
const bodyParser= require("body-parser");
const ejs=require("ejs");
const mongoose= require("mongoose");
const encrypt = require("mongoose-encryption");

const app= express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://0.0.0.0:27017/userDB", {useNewUrlParser: true});

const userSchema=new mongoose.Schema({ //now, it is not just a simple js object but the object created from mongoose encryption class
    email:String,
    password: String
});

 //creating var and storing the secret into it
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]}); //using this plugin to only encrypt the password attribute and not all the fields of secret page



const User= new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser= new User({
        email: req.body.username,
        password: req.body.password
    });
    //after encrypting upwards, when you save it will automatically convert the plain text to encrypted one and when you use "find" to search in your database it will decrypt it 
    newUser.save().then(function(){ 
        res.render("secrets");
    }).catch(function(err){
        console.log(err);
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password= req.body.password;
    User.findOne({email: username}).then(function(foundUser){
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }).catch(function(err){
        console.log(err);
    });
});

app.listen(3000, function(req, res){
    console.log("Server started on post 3000");
});







