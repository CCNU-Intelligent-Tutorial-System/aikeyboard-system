//include packages
utils = require('./utils');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'avatar/' });
const express = require('express');
const path = require('path');
// json-server router
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
// Jsonwebtoken
const jwt = require('jsonwebtoken');
// Connect Neo4j in heroku
var neo4j = require('neo4j');
var graphenedbURL = process.env['GRAPHENEDB_URL'] || "http://localhost:7474/db/data/"
var neo4jdb = new neo4j.GraphDatabase(graphenedbURL);
// Connect MySQL
const mysql = require('mysql');
var mysql_db;
function handleDisconnect() {
    mysql_db = mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || 'lonke',
        database: process.env.MYSQL_DATABASE || 'discrete_math',
    });
    mysql_db.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
        console.log("***MySQL Running***");
    });
    mysql_db.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();
// Cloudinary
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'ht3nqskad',
    api_key: '722969997287287',
    api_secret: 'fP0EqTfz5P7yI1rHzcaoc7001cM'
});  // Remove when remote
// nlp-compromise
const nlp = require('compromise');
// MongoDB and Socket.IO
const credentials = require('./credentials');
var ObjectID = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;
// const io = require('socket.io')(jsonServer, {
//     cors: {
//         origin: "http://localhost:8080",
//         methods: ["GET", "POST"]
//     }
// });
// const client = io.listen(5200).sockets;


// Before Routes
const cors = require('cors');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(middlewares);
server.use(cors);



server.get('/api', (req,res)=>{
    res.json({
        status: 'success',
        message:"Welcome to API!"
    });
});

server.get('/api/nlp', (req,res)=>{
    let doc = nlp("吴颖既用功又聪明.");
    res.json({
        status: 'success',
        message: doc
    });
});

server.get('/api/avatar/:userid', (req,res)=>{
    var userid = req.params.userid;
    var url = cloudinary.url(userid,{transformation: [
            {width: 400,height: 400,radius: "max", crop: "crop"},
            {width: 200, crop: "scale"},
            {default_image: "avatar0.png"}
        ]});
    res.json({
        status: 'success',
        avatar:url
    });
});
server.post('/api/avatar', upload.single('avatar'), (req,res)=>{
    var file = req.file;
    var userid = req.body['userid'];
    cloudinary.uploader.upload(file.path,
        function(result) {
            res.json({
                status: 'success',
                result: result
            })
        }, {public_id: userid});
});
server.post('/api/register',(req,res)=>{
    let body = req.body;
    let sql = `INSERT INTO  user (username,password,email) VALUES ('${body.username}','${body.password}','${body.email||'empty'}');`;
    mysql_db.query(sql, (err, result)=>{
        if (err) console.error(err);
        if (result !== 'undefined'){
            res.json({status: 'success'});
        }else{
            if (err.code === "ER_DUP_ENTRY") res.json({err:'username already exists.', message:'用户名已经存在。'});
            else res.json({status: 'fail',err:'insert database failed.', message:'用户注册失败。'});
        }
    })
})

server.post('/api/login',(req,res)=>{
    let body = req.body;
    console.log(`登入 ${body.email} ${body.password}`);
    let sql = `SELECT * FROM  user WHERE email='${body.email}' AND password='${body.password}';`;
    mysql_db.query(sql, (err, result)=>{
        if (err) console.error(err);
        if (result.length>0){
            jwt.sign({result},process.env.SECRET_KEY ||'mysecretkey', (err, token)=>{
                if(err){
                    res.json({
                        status: 'fail',
                        err: 'token authorization failed.',
                        message: 'Token授权失败，请重试。'
                    });
                }else{
                    res.json({
                        status: 'success',
                        token: token,
                    });
                }
            });
        }else{
            res.json({status: 'fail',err:'wrong username or password.', message:'用户名或密码错误。'});
        }
    })
});

server.use(router);
// server.use(utils.exclude('/api/:other', utils.verifyToken));
// Use JWT below

server.get('/userinfo', (req,res)=>{
    const userInfo = req.userInfo;
    res.json({
        status: 'success',
        userinfo: userInfo.user
    });
});

server.get('/graph/:p1', (req,res)=>{
    var p1 = req.params.p1;
    neo4jdb.cypher({
        query: 'MATCH (n:Person {name: {personName}}) RETURN n',
        params: {
            personName: p1
        }
    }, function(err, results){
        if (err) {
            console.error('Error of Neo4j:', err);
            res.json({
                status: 'fail',
                err: err
            });
        } else {
            res.json({
                status: 'success',
                data: results
            });
        }
    });
});


server.get('/api/neo4j/search/:c',(req,res)=>{
    // Connect Neo4j
    var c = req.params.c;
    var neo4j1 = require('neo4j-driver');
    var graphenedbURL1 = process.env['GRAPHENEDB_URL'] || "neo4j://localhost:7687"
    var driver1 = new neo4j1.driver(graphenedbURL1,  neo4j.auth.basic("neo4j", "lonke"));
    const session1 = driver1.session();
    session.run('MATCH (c:Concept) where c.name='+c+' return c')
        .then(result => {
            console.log( i ,' completed.');
        })
        .catch(e => {
            console.log(e);
        })
        .then(() => {
            return session.close();
        })
        .then(() => {
            return driver.close();
        });
});

server.use(jsonServer.bodyParser);


if (process.env.NODE_ENV==='production'){
    server.use(express.static(__dirname+'/public/'));
    server.get(/.*/,(req,res)=>{
        res.sendFile(path.resolve(__dirname,'/public/index.html'))
    });
}

server.listen(port,()=>{console.log("***JsonServer Running on "+port+"***")});

// const client = require('socket.io').listen(5200).sockets;
// mongo.connect(credentials.Mongo,function (err, db) {
//     if (err) throw err;
//     console.log("***MongoDB Connected on PORT 5200.");
//     client.on('connection',function(socket) {
//         console.log('***Socket connected.');
//         let postits = db.collection('postits');
//         let lines = db.collection('lines');
//         let sendStatus = function (s) {
//             socket.emit('status', s);
//         };
//         sendStatus('连接成功！');
//         postits.find({}).toArray(function (err, res) {
//             if (err) throw err;
//             if(res.length>0) {
//                 socket.emit('output', res);
//             }else {
//                 //初始化一些数据，可删除
//                 // var initdata = [ {
//                 //     "color" : "yellow",
//                 //     "pos" : {
//                 //         "x" : 489,
//                 //         "y" : 55
//                 //     },
//                 //     "text" : "路由1"
//                 // },  {
//                 //     "color" : "blue",
//                 //     "pos" : {
//                 //         "x" : 690,
//                 //         "y" : 252
//                 //     },
//                 //     "text" : "路由2"
//                 // }, {
//                 //     "color" : "red",
//                 //     "pos" : {
//                 //         "x" : 393,
//                 //         "y" : 354
//                 //     },
//                 //     "text" : "路由3"
//                 // } ];
//                 // postits.insertMany(initdata);
//                 // //初始化 结束
//                 // socket.emit('output', initdata);
//                 socket.emit('output', []);
//             }
//         });
//
//         lines.find({}).toArray(function (err, res) {
//             if (err) throw err;
//             socket.emit('lines', res);
//         });
//
//         socket.on('addpostit', function (newpostit) {
//             postits.insertOne(newpostit,function (err, res) {
//                 if (err) throw err;
//                 postits.find({}).limit(20).toArray(function (err, res) {
//                     if (err) throw err;
//                     socket.emit('output', res);
//                 });
//             });
//         });
//
//         socket.on('addpostits', function (newpostits) {
//             if (newpostits.data.length===0){
//                 sendStatus('数据为空');
//             }
//             var userId = newpostits.userId,problemId = newpostits.problemId;
//             postits.updateOne({$and:[{userId:userId},{problemId:problemId}]}, {
//                 $set:{
//                     data: newpostits.data
//                 }
//             },{ upsert: true },function (err, res) {
//                 if (err) throw err;
//                 // console.log(res);
//                 sendStatus('保存成功！')
//             });
//         });
//
//         socket.on('update', function (newpostit) {
//             let _id = ObjectID(newpostit._id);
//             delete newpostit['_id'];
//             postits.updateOne({_id:_id},newpostit,function (err, res) {
//                 if (err) throw err;
//                 // console.log(res);
//             });
//         });
//
//         socket.on('delete', function (newpostit) {
//             if (newpostit._id === null) return;
//             var ObjectId = require('mongodb').ObjectID;
//             let _id = ObjectId(newpostit._id);
//             console.log("_id",_id,"type",typeof _id);
//             lines.deleteMany({$or:[{startId:newpostit._id},{endId:newpostit._id}]},function (err, res) {
//                 if (err) throw err;
//                 lines.find({}).toArray(function (err, res) {
//                     if (err) throw err;
//                     socket.emit('lines', res);
//                 });
//             });
//
//             postits.deleteOne({_id:_id},function (err, res) {
//                 if (err) throw err;
//                 sendStatus('删除成功！');
//             });
//         });
//
//
//         socket.on('deletelines', function (mlines) {
//             if (mlines.length===0) return;
//
//             mlines.forEach((lid)=>{
//                 let _id = ObjectID(lid);
//                 lines.deleteOne({_id:_id},function(err, result) {
//                     if (err) {
//                         sendStatus('删除失败！');
//                     }
//                     sendStatus('删除成功！');
//                 });
//             })
//         });
//
//
//         socket.on('addline',function (newline) {
//             //此时的_id是string类型
//             var startId = newline.startId;
//             var endId = newline.endId;
//             var color = newline.color?newline.color:'#00e0a8';
//             if (startId>endId){
//                 let t = startId;
//                 startId = endId;
//                 endId = t;
//             }
//             lines.updateOne({$and:[{userId:newline.userId},{problemId:newline.problemId},{startId:startId},{endId:endId},]}, {
//                 $set:{color: color}
//             },{ upsert: true },function (err,result) {
//                 lines.find({}).toArray(function (err, res) {
//                     if (err) throw err;
//                     sendStatus('添加成功！');
//                     socket.emit('lines', res);
//                 });
//             });
//
//
//         });
//
//         socket.on('deleteAll', function () {
//
//             lines.deleteMany({},function (err) {
//                 if (err) throw err;
//                 socket.emit('lines', []);
//             });
//
//             postits.deleteMany({},function (err) {
//                 if (err) throw err;
//                 socket.emit('output', []);
//                 sendStatus('删除成功！');
//             });
//         });
//
//         socket.on('search',function (concept){
//             // Connect Neo4j
//             var neo4j1 = require('neo4j-driver');
//             var graphenedbURL1 = process.env['GRAPHENEDB_URL'] || "neo4j://localhost:7687"
//             var driver1 = new neo4j1.driver(graphenedbURL1,  neo4j1.auth.basic("neo4j", "lonke"));
//             const session1 = driver1.session();
//             session1.run('MATCH (c:Concept) where c.name="'+concept+'" return c')
//                 .then(result => {
//                     socket.emit('searchResult', result.records);
//                 })
//                 .catch(e => {
//                     throw e;
//                 })
//                 .then(() => {
//                     return session.close();
//                 })
//                 .then(() => {
//                     return driver.close();
//                 });
//         })
//
//
//         socket.on('disconnect', function () {
//             sendStatus({message:'失去连接！',type:'error'});
//             console.log('Disconnected');
//         });
//     });
// })