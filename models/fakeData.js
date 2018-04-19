const mongoose = require('mongoose');

let nameSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  }
})
// 
// let connection = mongoose.connect('mongoDB://localhost:27017/fakeData')
// let Name = connection.model('Name', nameSchema)
//
// module.exports = Name
