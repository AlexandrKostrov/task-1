// const express = require('express');
// const http = require('http')
const app = require('express')();
// const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var async = require('async');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


const server = require('http').Server(app);

const io = require('socket.io')(server);
const users = [];
// This is what the socket.io syntax is like, we will work this later
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('message', function(msg){
        
        const msgObject = JSON.parse(msg);
        if(users.indexOf(msgObject.nick) == -1)
       { users.push(msgObject.nick);}
        msgObject.users = users;
        console.log(msgObject);
        io.emit('message',msgObject);
      });
  });

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(cookieParser());
const MongoStore = require('connect-mongo')(session);
app.use(session({
    "secret": "KillerIsJim",
    "key": "sid",
    "cookie": {
        "path": "/",
        "httpOnly": true,
        "maxAge": null
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
// app.use((req, res, next) => {
//     req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
//     res.send(`Visits ${req.session.numberOfVisits}`);
// })
 
const { User } = require('./models/User');
 

app.get('/', (req,res) => {
    res.send("Connected successfully!");
})

app.get('/chat', (req, res) => {
    User.find({}, (err, doc) => {
        if (err) return res.status(400).send(err);
        res.send(doc);
    });
});
app.post('/', (req, res) => {
    
    const newUser = new User({
        nick: req.body.nick,
        email: req.body.email,
        password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
           // newUser.save().then(user => res.send(user));
        })
    });   
    User.findOne({email: newUser.email}).then(
        user => {
            console.log(user);
            
             if(user){
            //     bcrypt.compare(newUser.password, user.password, (err, isMatch) => {
            //         if(err) throw err;
            //         if(isMatch) {
            //             console.log(user);
            res.send(user);
                  }
            //     })}
            else {
                 newUser.save().then(user => res.send(user));
             }
        }
    )
    
    // User.findOne({nick:user.nick}, (err, doc) => {
    //     if (err) return res.status(400).send(err);
         
    //     res.send(doc); 
    //     // else {
    //     //     User.create({nick:nick,email:email,password:password}, (err, doc) => {
    //     //         if (err) return res.status(400).send(err);
    //     //         res.send(doc);
    //     //     })
    //     // }
    // });
   // res.send({nick,password});
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(port);
    console.log("SERVER RUNNING")
})