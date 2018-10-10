const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  
    nick: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true,
}
,
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
    }
});

UserSchema.statics.authorize = function (nick, email, password, callback) {
    const User = this;
    User.findOne({nick: nick}).then(
        user => {
            //console.log(user);
            
             if(user){
                user.active = true;
                callback(user);
                  }

            else {
                const user = new User({nick: nick,email: email, password: password,active: true});
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if(err) throw err;
                        user.password = hash;
                        user.save().then(user => {
                   
                            callback(user);;
                        });
                    })
                });
             
             }
        }
    )
}

const User = mongoose.model('user', UserSchema);


module.exports = { User };