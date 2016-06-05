// Here is the starting point for your application code.
// All stuff below is just to show you how it works. You can delete all of it.

// Use new ES6 modules syntax for everything.
import os from 'os'; // native node.js module
import { remote } from 'electron'; // native electron module
import jetpack from 'fs-jetpack'; // module loaded from npm
import { greet } from './hello_world/hello_world'; // code authored by you in this project
import env from './env';
import express from 'express';
import bodyparser from 'body-parser';
import path from 'path';
var cp = require('child_process');
var child = cp.fork('./app/index.js');
console.log('Loaded environment variables:', env);

var expapp = express();
expapp.use(bodyparser.json());
var server = require('http').Server(expapp);
var classes = new Array();
/*
  pages
*/
expapp.use('/js/',express.static(__dirname+'/../app/js/'));
expapp.use('/css/',express.static(__dirname+'/../app/css/'));
expapp.use('/font/',express.static(__dirname+'/../app/font/'));
expapp.get('/',(req,res)=>{
  res.sendfile("/app/Login.html",{'root':__dirname+'/..'});
});
expapp.post("/",(req,res)=>{
  var temp = req.body;
  console.log(temp.username);
  res.send("ty");
})
expapp.get('/newclass',(req,res)=>{
  res.sendFile("/app/createclass.html",{'root':__dirname+'/..'});
});
expapp.get("/class*",function (req,res) {
  res.sendfile("/app/class.html",{'root':__dirname+'/..'});
});
expapp.post('/newclass',(req,res)=>{
  var newclass = req.body;
  console.log(newclass);
  classes.push(newclass);
  res.send("ty");
});
expapp.get('/classes',(req,res)=>{
  var temp = {classes:classes};
  res.send(JSON.stringify(temp));
});
expapp.listen(3000);
//Pages end

/*Signaller
require('./hello_world/signalling-server')(server, function(socket){
  var params = socket.handshake.query;
  console.log("GHesdf");
  if (!params.socketCustomEvent) {
    params.socketCustomEvent = 'custom-message';
}
  socket.on(params.socketCustomEvent,function(msg){
    socket.broadcast.emit(params.socketCustomEvent, msg);
  });
});
End Signaller
*/
var app = remote.app;
var appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
console.log('The author of this app is:', appDir.read('package.json', 'json').author);

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('greet').innerHTML = greet();
    document.getElementById('platform-info').innerHTML = os.platform();
    document.getElementById('env-name').innerHTML = env.name;

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
document.getElementById('IP').innerHTML = addresses.toString();
});
