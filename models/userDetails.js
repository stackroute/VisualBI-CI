var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserDetailsSchema = mongoose.Schema({
  username: String,
  password: String,
  activeConnection: {type:mongoose.Schema.Types.ObjectId, ref:'Connection' },
  connections: [{type:mongoose.Schema.Types.ObjectId, ref:'Connection' }]
});
UserDetailsSchema.plugin(passportLocalMongoose);
var UserDetails = mongoose.model('UserDetails', UserDetailsSchema);

module.exports = UserDetails;
