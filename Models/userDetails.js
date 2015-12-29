var mongoose = require('mongoose');

var UserDetailsSchema = mongoose.Schema({
  username: String,
  password: String,
  activeConnection: mongoose.Schema.Types.ObjectId,
  connections: [mongoose.Schema.Types.ObjectId]
});

var UserDetails = mongoose.model('UserDetails', UserDetailsSchema);

module.exports = UserDetails;
