const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
});

UserSchema.statics.authorize = function (nick, email, password, callback) {
    const User = this;

    User.findOne({nick: nick}).then(
        user => {
            
             if(user){
                 console.log("inner user ",user.nick);
                 bcrypt.compare(password,user.password, (err,isMatch) => {
                   if(err) throw err;
                   console.log("PASSWORD CHECKING LOGGING",isMatch);
                   if(isMatch)
                  { User.update({nick:user.nick},{$set:{active: true}}).then(res => callback(user))}
                  else {
                      callback("The password is not correct");
                  }
                 })
               
               
                  }

            else {
              
                  User.find({}).then(res => {
                      console.log("ALL users", res.length);
                      let admin = false; 
                      if(res.length === 0) {
                        admin = true;
                      }
                      if(/^[a-zA-Z0-9- ]{3,}$/.test(nick) == false) {callback("Your name is not correct!")}
                      else {   const user = new User({nick: nick, email: email, password: password, active: true, admin: admin, banned: false, muted: false});
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
// UserSchema.methods.generateToken = function (cb) {
//     const user = this;
//     const token = jwt.sign(user._id.toHexString(), 'supersecret');
//     user.token = token;
//     user.save((err, user) => {
//         if(err) return cb(err);
//         cb(null,user);
//     })
// }

const User = mongoose.model('user', UserSchema);


module.exports = { User };