const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    FI: {
        type: String,
        required: true,
        maxlength: 120,
},
nick: {
    type: String,
        required: true,
        maxlength: 50,
}
,
    email: {
        type: String,
        required: true,
},
})

const Users = mongoose.model('users', UsersSchema);


module.exports = { Users };