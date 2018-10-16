const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const config = require('./config.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');


const MongoStore = require('connect-mongo')(session);
const { User } = require('./models/User');


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


io.use(function(socket, next) {
    sessionMidleware(socket.request, socket.request.res, next);
  })

io.on('connection', function(socket){
    console.log('a user connected');
     
    User.findByToken(socket.handshake.query.token).then(user => {
 
        console.log("USER BANNED" ,user.banned);
        if (!user || user.banned){
            socket.disconnect();
        }
        // user.muted = false;
        // user.save();
       socket.user = user;
        
    
        socket.on('initUser', function () {
            
            console.log("INCOMINGTOKEN");
                socket.emit('initUser',{
                    id:  user._id,
                    nick:  user.nick,
                    color:  user.color,
                    admin: user.admin,
                    muted: user.muted,
                    banned: user.banned,
                });
        });
    
        socket.on('userList', function () {
            User.find({active:true}).then(otv => {
                 io.emit('userList',otv.map((user)=>{
                     return {
                         id: user._id,
                         nick: user.nick,
                         color: user.color,
                     };
                 }))
             });
         });

        socket.on('ban', function (id) {
            if (socket.user.admin !== true){
                return;
            }
    
            User.findOne({_id: id}).then((user) => {
                user.banned = true; 
                user.save();
                console.log(user);
                io.emit('ban',{id: user._id}); 
            })
        });
    
        socket.on('unban', function (id) {
            if (socket.user.admin !== true){
                return;
            }
    
            User.findOne({_id: id}).then((user) => {
                user.banned = false; 
                user.save();
                console.log(user);
                io.emit('unban',{id: user._id});
            })
        });
        
        socket.on('mute', function (id) {
            if (socket.user.admin !== true){
                return;
            }
            console.log("ID OF INCOMMING USER IS",id);
            User.findOne({_id: id}).then((user) => {
                user.muted = true; 
                user.save();
                console.log(user);
                io.emit('mute',{id: user._id});
            });
        });
    
        socket.on('unmute', function (id) {
            if (socket.user.admin !== true){
                return;
            }
    
            User.findOne({_id: id}).then((user) => {
                user.muted = false; 
                user.save();
                console.log(user);
                io.emit('unmute',{id: user._id, wasUnmuted: 7});
            });
        });   
    
        socket.on('logout', ()=>{
            socket.user.active = false;
            socket.user.save();
            console.log("DISCONECTED!!!!");
            socket.emit('test',{
                id: user._id
            });
        })
    
        socket.on('disconnect', () => {   
            console.log('disconected user is', user.nick);
            
        });
    
        socket.on('getAllUsers', function() {
            if (user.admin !== true){
                return;
            }
    
           User.find({}).then((res) => {
                socket.emit('getAllUsers',res.map((user)=>{
                    return {
                        id: user._id,
                        img: user.img,
                        nick: user.nick,
                        ban: user.banned,
                        mute: user.muted,
                        admin: user.admin,
                    };
                }))
            });
        });
    
        socket.on('message', function(msg){
            const msgObject = JSON.parse(msg);
            if (msgObject.forceHim) {
                user.muted = false;
                user.save();
            }  
            if (user.muted){
                return;
            }
    
            // check for time
           if (Math.floor((Date.now() - msgObject.lastMessage)/1000) < 15) {
               return;
           }
    
            const {message, color, nick} = msgObject;
    
            console.log("THE NICK OF THE SENDER IS", nick)
            if (!message || message.length > 200){
                return;
            }
    
            io.emit('message', {
                message,
                color,
                nick,
                id: user._id,
            });
          });
    })
   
  });


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(cookieParser());


app.use(sessionMidleware);
 
app.get('/', (req,res) => {
    res.send("Connected successfully!"); 
});

app.post('/logout', (req, res) => {
    req.session.destroy(); 
});

 app.post('/chat', (req, res) => {
     const nick = req.body.nick;
     const email = req.body.email;
     const password = req.body.password;
     const socialNet = req.body.socialNet;
     const picture = req.body.picture;
     const socials = req.body.socials;
     User.authorize(nick, email, password, socialNet, picture, socials, function (user){  
         if(user._id){
            req.session.user = user._id;
            res.send(user);
        } else {
             res.send({msg:user});
         }
     });
 });

 

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(port);
    console.log("SERVER RUNNING")
}) 