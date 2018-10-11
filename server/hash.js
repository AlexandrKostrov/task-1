 
const jwt = require('jsonwebtoken');

const id = '1000';
const secret = "secret";

const token = jwt.sign(id,secret);

const recievedToken = 'eyJhbGciOiJIUzI1NiJ9.MTAwMA.Mtqla2KOCm6LNox8cmKkLWsyMXi_6DHa8LuNzY8O2Wc';

const decodeToken = jwt.verify(recievedToken,secret);

console.log(token);
console.log(decodeToken);