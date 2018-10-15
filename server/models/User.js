const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar-api');
const getRandomColor = require('../functions/generateColor.js');

const UserSchema = new Schema({
  
nick: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true,
}
,
token: {
    type: String,
    
},
    email: {
        type: String,
        required: true,
},
    password: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    admin: {
        type: Boolean,
        required: false,
    },
    banned: {
        type: Boolean,
        required: false,
    },
    muted: {
        type: Boolean,
        required: false,
    },
    sended: {
        type: Boolean,
        required: true, 
    },
    color: {
        type: String,
        required: true,
    },
    img: 
    {
        type: String, 
    },
    socialNet: {
        type: Boolean,
        required: true, 
    }
});

UserSchema.statics.authorize =  function (nick, email, password, socialNet, picture, socials, callback) {
    const User = this;

    User.findOne({nick: nick}).then(
        user => {
            
             if(user){
                 if(user.socialNet && !socials) {callback("You can only login with SocialNet")}
                 else {
                 console.log("inner user ",user.nick);
                 bcrypt.compare(password,user.password, (err, isMatch) => {
                   if(err) throw err;
                   console.log("PASSWORD CHECKING LOGGING",isMatch);
                   if(isMatch)
                  { User.update({nick:user.nick},{$set:{active: true,sended: false}}).then(res => callback(user))}
                  else {
                      callback("The password is not correct");
                  }
                 }) }}       

            else {
              
                  User.find({}).then( res => {
                      console.log("ALL users", res.length);
                      let admin = false; 
                      if(res.length === 0) {
                        admin = true;
                      }
                      if(/^[a-zA-Z0-9- ]{3,}$/.test(nick) == false) {callback("Your name is not correct!")}
                      else {  
                        const options = {
                            email: 'katykonovalova1987@gmail.com',
                            parameters: { "size": "40" }
                        }
                          const avatar = picture? picture: gravatar.imageUrl(options);
                        console.log("AVATAR IS HERE",avatar);
                        const color = getRandomColor();
                        const user = new User({nick: nick, email: email, password: password, active: true, 
                        admin: admin, banned: false, muted: false, sended: false,color: color, img: avatar, socialNet: socialNet});
                      admin = false;
                      bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(user.password, salt, (err, hash) => {
                            if(err) throw err;
                            user.password = hash;
                            const token = jwt.sign(user._id.toHexString(), 'supersecret');
                            user.token = token;
                            user.save().then(user => {
                       
                                callback(user);;
                            });
                        })
                    });}
                   
                    })
             }
        }
    )
}

UserSchema.statics.findByToken = function (token, cb) {
  const user = this;
  jwt.verify(token,'supersecret', (err, decode) => {
      user.findOne({_id:decode,token:token}).then((user) => {
          
          cb(user);
      })
  }) 
}


const User = mongoose.model('user', UserSchema);


module.exports = { User };