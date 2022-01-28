require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

mongoose.connect('mongodb://localhost:27017/test');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const { Schema } = mongoose;

const userSchema = new Schema({ 
    username: String,
    password: String
     });

userSchema.plugin(encrypt, {  secret: process.env.SECRET, encryptedFields: ["password"]});

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
            const user1 = new User({
                username: req.body.username,
                password: req.body.password
            });
            user1.save((err) =>{
               res.render("secrets");
            });
        }
    });

    
});

app.post("/login", (req, res) =>{
    User.findOne({username: req.body.username}, (err, docs) =>{
        if(docs){
            if(req.body.password===docs.password){
                res.render("secrets");
            }else{
              res.redirect("/login");
            }
           
        }else{
            res.redirect("/");
        }
    });   
});


















app.listen(3000, ()=>{
    console.log("app running on port 3000");
});
