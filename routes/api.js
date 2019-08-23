/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'
const mongoose = require('mongoose');
const {Schema} = mongoose;
var expect = require('chai').expect;

let replySchema = new Schema({
  text: String,
  delete_password: String,
  created_on:{type: Date, default: Date.now()},
  reported: {type:Boolean, default: false}
})

let threadSchema = new Schema({
  text: String,
  delete_password: String,
  created_on:{type: Date, default: Date.now()},
  bumped_on:{type: Date, default: Date.now()},
  reported: {type:Boolean, default: false},
  replies: [replySchema]
})


let Thread = mongoose.model("thread", threadSchema);
let Reply = mongoose.model("reply", replySchema);
const CONNECTION_STRING = process.env.DB; 

mongoose.connect(CONNECTION_STRING,(err,db)=>{
  if(err){
    console.log("could not connect to mongoDB");
  }
  else{
    console.log("connected successfully to mongoDB")
  }
})

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .post(function(req,res){

    let thread = new Thread({
      text: req.body.text,
      delete_password: req.body.delete_password
    })
    thread.save((err)=>{
      if(err){
        console.log("couldn't save the thread")
      }
      else{
        res.send(thread)
      }
    })
  })
  
  
  .put(function(req,res){
    Thread.findOne({_id:req.body._id},(err,thread)=>{
      thread.reported = true;
      thread.save((err)=>{
        if(err){
          res.send("deleted failed");
        }
        else{
          res.send("success")  ;      
        }
      })
    })
  })
  
  
  .get(function(req,res){
    Thread.find().sort('-bumped_on').limit(10).exec((err,threads)=>{
  
      let resThreads = threads.map(thread=>{
        let replyMap = thread.replies.map(reply=>{
          return {_id:reply._id,created_on:reply.created_on,text:reply.text}
        })
        let resReplies = replyMap.length<=3? replyMap:replyMap[replyMap.length-3,replyMap.length-1];
        return {_id:thread._id,created_on:thread.created_on,bumped_on:thread.bumped_on,text:thread.text, replies: resReplies}
      })
      res.send(resThreads)
    })
  })
  
  
  .delete(function(req,res){
    Thread.deleteOne({_id:req.body._id,delete_password:req.body.delete_password},err=>{
      if(err){
        res.send("incorrect password")
      }
      else{
        res.send("success")
      }
    })
  })
  ;
    
  app.route('/api/replies/:board')
  .post(function(req,res){
    Thread.findOne({_id:req.body._id},(err,thread)=>{
      let reply = new Reply({
        text: req.body.text,
        delete_password: req.body.delete_password
      });
      
      thread.replies.push(reply);
      thread.bumped_on=Date.now();
      thread.save((err)=>{
        if(err){
          console.log("couldn't add a reply")
        }
        else{
          res.send(thread);
        }
      })
    })
  })
  
  
  .put(function(req,res){
     Thread.findOne({_id:req.body.thread_id},(err,thread)=>{
      var reply = thread.replies.id(req.body.reply_id);
      reply.reported = true;
      thread.save((err)=>{
        if(err){
          res.send("deleted failed");
        }
        else{
          res.send("success");         
        }
      })
    })
  })
  
  
  .get(function(req,res){
    Thread.find({_id:req.query._id}).exec((err,threads)=>{

      let resThreads = threads.map(thread=>{
        let replyMap = thread.replies.map(reply=>{
          return {_id:reply._id,created_on:reply.created_on,text:reply.text}
        })     
        return {_id:thread._id,created_on:thread.created_on,bumped_on:thread.bumped_on,text:thread.text, replies: replyMap}
      })
      res.send(resThreads)
    })
  })
  
  
  .delete(function(req,res){
    Thread.findOne({_id:req.body.thread_id},(err,thread)=>{
      var reply = thread.replies.id(req.body.reply_id);
      reply.text = "[deleted]";
      thread.save((err)=>{
        if(err){
          res.send("deleted failed");
        }
        else{
          res.send("success")  ;      
        }
      })
    })
  })
  ;
};
