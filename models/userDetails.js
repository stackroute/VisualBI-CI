var mongoose = require('mongoose');
// var ConnectionsSchema = mongoose.Schema({
//   connectionName: String,
//   serverURL: String,
//   userid: String,
//   password: String
// });
//
// var Connection = mongoose.model('Connection',ConnectionsSchema);


var UserDetailsSchema = mongoose.Schema({
  username: String,
  password: String,
  activeConnection: {type:mongoose.Schema.Types.ObjectId, ref:'Connection' },
  connections: [{type:mongoose.Schema.Types.ObjectId, ref:'Connection' }]
});

var UserDetails = mongoose.model('UserDetails', UserDetailsSchema);

module.exports = UserDetails;
