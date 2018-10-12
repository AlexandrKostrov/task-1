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
        })
    //     User.update({nick:nick},{$set:{muted: true}}).then(res =>
    //        {
    //        io.emit('mute',nick)}
    //    );
         });
    // socket.on('checkState', function(nick) {
    //     console.log("INCOMING nick:",nick)
    //     User.findOne({nick: nick}).then(res => {
    //        const banned = res.banned;
    //        const mutted = res.mutted;
    //        const nick = res.nick;
    //        io.emit('checkState', {banned:banned,mutted:mutted,nick:nick});
    //    })
    // });     
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
      
        
        console.log(msgObject);
        console.log(socket.request.session.user);
        io.emit('message',msgObject);
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
         req.session.user = user._id;
    
         res.send(user);
     });
 });



const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(port);
    console.log("SERVER RUNNING")
}) 