require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;
// const md5 = require("md5");
// const encrypt = require('mongoose-encryption');


mongoose.connect('mongodb://localhost:27017/test');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const { Schema } = mongoose;

const userSchema = new Schema({ 
    username: String,
    password: String
     });

// userSchema.plugin(encrypt, {  secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);


app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.post("/register", (req, res) =>{
    User.findOne({username: req.body.username}, (err, docs) =>{
        if(docs){
            console.log("It is already in the Database ooo.");
            res.redirect("/login");
        }else{
            const name= req.body.username;
            const pass = req.body.password;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(pass, salt, function(err, hash) {
                    // Store hash in your password DB.
                    const user1 = new User({
                        username: name,
                        password: hash
                    });
                    user1.save((err) =>{
                       res.render("secrets");
                    });
                });
            });
            
        }
    });

    
});

app.post("/login", (req, res) =>{
    User.findOne({username: req.body.username}, (err, docs) =>{
        if(docs){
            bcrypt.compare(req.body.password, docs.password, function(err, result) {
                // result == true
                if(result){
                    res.render("secrets");
                }else{
                    res.redirect("/login");
                }
            });
           
        }else{
            res.redirect("/register");
        }
    });   
});


















app.listen(3000, ()=>{
    console.log("app running on port 3000");
});
