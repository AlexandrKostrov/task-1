const mongoose = require('mongoose'),  
      Schema = mongoose.Schema;

const MessageSchema = new Schema({  
  date: {type: Date},
  content: {type: String},
  username: {type: String}
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Message', MessageSchema); 