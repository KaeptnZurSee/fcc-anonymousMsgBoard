/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Test POST /api/threads/:board',function(done){
        chai.request(server)
        .post('/api/threads/test')
        .send({text:"test123",delete_password:"123"})
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.isObject(res.body);
          assert.isArray(res.body.replies);
          assert.equal(res.body.text,'test123');
          assert.equal(res.body.delete_password,'123');
          assert.typeOf(res.body.created_on,'string')
          done()
        })
      })
    });
    
    suite('GET', function() {
      test('Test POST /api/threads/:board',function(done){
        chai.request(server)
        .get('/api/threads/test')
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.isArray(res.body);
          assert.operator(res.body.length,'<=',10);   
          done()
        })
      })
    });
    
    suite('DELETE', function() {
      test('Test POST /api/threads/:board',function(done){
        chai.request(server)
        .delete('/api/threads/test')
        .send({_id:"5d5ef09f4ddb581c8e292065",delete_password:"123"})
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.text,"success")
          done()
        })
      })
    });
    
    suite('PUT', function() {
      test('Test POST /api/threads/:board',function(done){
        chai.request(server)
        .put('/api/threads/test')
        .send({_id:"5d5ef0b7dbf21d1cea47d308"})
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.text,"success")
          done()
        })
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
       test('Test POST /api/replies/:board',function(done){
        chai.request(server)
        .post('/api/replies/test')
        .send({_id:'5d5ef0b7dbf21d1cea47d308',text:"test123",delete_password:"123"})
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.isObject(res.body);
          assert.property(res.body,'text');
          assert.property(res.body,'created_on');
          assert.property(res.body,'_id');
          assert.property(res.body,'bumped_on');
          assert.property(res.body,'delete_password');
          assert.property(res.body,'replies');
          assert.operator(res.body.replies.length,'>=',1)
          done()
        })
      })
    });
    
    suite('GET', function() {
       test('Test POST /api/replies/:board',function(done){
        chai.request(server)
        .get('/api/replies/test?_id=5d5ef0b7dbf21d1cea47d308')
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.isArray(res.body);
          assert.property(res.body[0],'text');
          assert.property(res.body[0],'created_on');
          assert.property(res.body[0],'_id');
          assert.notProperty(res.body[0],'delete_password');
          assert.notProperty(res.body[0],'reported');
          done()
        })
      })
    });
    
    suite('PUT', function() {
       test('Test POST /api/replies/:board',function(done){
        chai.request(server)
        .put('/api/replies/test')
        .send({thread_id:'5d5ef0b7dbf21d1cea47d308', reply_id:'5d5ef1c7920f4826c4114c2c'})
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.text,"success")
          done()
        })
      })
    });
    
    suite('DELETE', function() {
       test('Test POST /api/replies/:board',function(done){
        chai.request(server)
        .delete('/api/replies/test')
        .send({thread_id:"5d5ef0b7dbf21d1cea47d308",reply_id:'5d5ef1c7920f4826c4114c2c'})
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.text,"success")
          done()
        })
      })
    });
    
  });

});
