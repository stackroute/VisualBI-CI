var mongoose = require('mongoose');

var ConnectionsSchema = mongoose.Schema({
  connectionName: String,
  serverURL: String,
  userid: String,
  password: String
});

ConnectionsSchema.methods.getConnectionId = function() {
  return this._id;
};
ConnectionsSchema.methods.getServer = function(){
  return (this.serverURL+"?userid="+this.userid+"&password="+this.password);
};
var Connections = mongoose.model('Connection', ConnectionsSchema);
module.exports = Connections;
