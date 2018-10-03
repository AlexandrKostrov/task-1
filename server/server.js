const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/users', { useNewUrlParser: true });

app.use(bodyParser.json());

 
const { User } = require('./models/User');
 

app.get('/chat', (req, res) => {
    User.find({}, (err, doc) => {
        if (err) return res.status(400).send(err);
        res.send(doc);
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("SERVER RUNNING")
})