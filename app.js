//jshint esversion:6

const express = require("express");

const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.static("public"));

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology: true});

const articleSchema=new mongoose.Schema({
    title: String,
    content: String

})
const Article=mongoose.model("Article",articleSchema);

///////////////////////////////////////////////
app.route("/article")
.get(function(req,res){
    Article.find(function(err,foundArticle){
        if(!err){

            res.send(foundArticle);
        }
         else{
             res.send(err);
         }
    }) 

})
.post(function(req,res){
   
    const newArticle =new Article({
        title: req.body.title,
        content:req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            res.send("success");

        }
        else
        res.send("failed");
    });
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("success")
        }
        else
          res.send("failure")

    });
});

/////////////////////////////////////////////////////////
app.route("/article/:postName")
.get(function(req,res){
   Article.findOne({title: req.params.postName},function(err,foundArticle){
       if(foundArticle){
           res.send(foundArticle);
       }
       else{
           res.send("no article found");
       }
   })


})

.put(function(req,res){
    Article.replaceOne({title:req.params.postName},{
        title:req.body.title,
        content:req.body.content
    },{overwrite:true},function(err){
        if(!err){
            res.send("success");
        }
        else
        res.send("failed");
    });



})

.patch(function(req,res){
    Article.replaceOne({title:req.params.postName},{$set:req.body},function(err){
      if(!err){
          res.send('success');
      }
      else
      res.send("failed");

    })
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.postName},function(err){
        if(!err){
            res.send("success");
        }
        else{
            res.send("failed")
        }
    })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
