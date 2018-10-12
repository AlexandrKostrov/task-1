// const express = require('express');
// const http = require('http')
const app = require('express')();
// const socketIO = require('socket.io');
const mongoose = require('mongoose');

var async = require('async');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


const server = require('http').Server(app);
const MongoStore = require('connect-mongo')(session);
const { User } = require('./models/User');

const io = require('socket.io')(server);
const sessionMidleware = session({
    "secret": "KillerIsJim",
    "key": "sid",
    "cookie": {
        "path": "/",
        "httpOnly": true,
        "maxAge": null
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
});

const curUsers = [];

// This is what the socket.io syntax is like, we will work this later
io.use(function(socket, next) {
    sessionMidleware(socket.request, socket.request.res, next);
  })

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('initUser', function (token) {
        console.log("INCOMINGTOKEN", token);
        User.findByToken(token,(user) => {
            console.log("ToKEN", user);
            io.emit('initUser',user);
        })
         });
    
    socket.on('ban', function (token) {
        User.findByToken(token, (user) => {
            user.banned = !user.banned;
            user.save();
            console.log(user);
            io.emit('ban',user);
            io.disconnect(0);
        })
    })
    socket.on('userList', function () {
       User.find({active:true}).then(otv => {
        io.emit('userList',otv);
     });
    });
    socket.on('mute', function (token) {
        User.findByToken(token, (user) => {
            user.muted = !user.muted;
            user.save();
            console.log(user);
             io.emit('mute',{token:token,muted:user.muted});
        });  
    });
    
    socket.on('msgSend', function(token) {
        User.findByToken(token, (user) => {
            user.sended = !user.sended;
            user.save();
            console.log(user);
             io.emit('msgSend',{token:token,sended:user.sended});
        }); 
    })    

    socket.on('logout', function(token) {   
        console.log('nick',token);
        User.update({token: token},{$set:{active: false}}).then( 
             User.find({active:true}).then(otv => {
             console.log("active users", otv)
            io.emit('logout',otv);
         })
        );  
    });
    socket.on('getAllUsers', function() {
       User.find({}).then(res => io.emit('getAllUsers',res));
    });
    socket.on('message', function(msg){
        
        const msgObject = JSON.parse(msg);
        User.findByToken(msgObject.token, (user) => {
            if(!user.banned || !user.muted){
                if(msgObject.message.length<200 ){
                console.log(msgObject);
                console.log(msgObject.message.length);
                console.log(socket.request.session.user);
                msgObject.color = {color:user.color};
                io.emit('message',msgObject);}
            }
        })
        
       
      });
  });


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(cookieParser());


app.use(sessionMidleware);
// app.use((req, res, next) => {
//     req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
//     res.send(`Visits ${req.session.numberOfVisits}`);
// })
 
 

app.get('/', (req,res) => {
    res.send("Connected successfully!");
  
})

app.post('/logout', (req, res) => {
    req.session.destroy();
   
});

 app.post('/chat', (req, res) => {
     const nick = req.body.nick;
     const email = req.body.email;
     const password = req.body.password;
    // const active = true;
     User.authorize(nick, email, password, function (user){  
         if(user._id){
         req.session.user = user._id;
    
         res.send(user);}
         else {
             res.send({msg:user});
         }
     });
 });



const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(port);
    console.log("SERVER RUNNING")
}) 