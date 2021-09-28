const mongoose = require('mongoose');
const config = require('../config/index.js');

let username = config.get('db').username;
let password = config.get('db').password;
let dbname = config.get('db').dbname;
let host = config.get('db').host;

let dsn = `mongodb+srv://${username}:${password}@${host}/${dbname}?retryWrites=true&w=majority`

mongoose.connect(
    dsn,
  {
    useNewUrlParser: true,
    useUnifiedTopology:true
  },
  err =>{
      if(err){
          return console.log('Could not connect to database: ', err);
      }
      console.log('Successfully connected to database');
  }
);