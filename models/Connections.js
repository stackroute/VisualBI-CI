var mongoose = require('mongoose');

var ConnectionsSchema = mongoose.Schema({
  connectionName: String,
  serverURL: String,
  userid: String,
  password: String,
  savedQueries: [{
    _id: {type: String},
    queryName: {type: String},
    // createdBy: String,
    createdOn: Date,
    modifiedOn: {type: Date, default: Date.now},
    onColumns: [{
                unique_name: String,
                caption_name: String,
                isMember: String
               }],
    onRows: [{
             unique_name: String,
             caption_name: String,
             isMember: String
            }],
    onFilters: [String],
    queryMDX: String,
    connectionData: {
                    //  xmlaServer: String,
                     dataSource: String,
                     catalog: String,
                     cube: String
                    }
  }]
});

ConnectionsSchema.methods.getConnectionId = function() {
  return this._id;
};
ConnectionsSchema.methods.getServer = function(){
  return (this.serverURL+"?userid="+this.userid+"&password="+this.password);
};
var Connections = mongoose.model('Connection', ConnectionsSchema);
module.exports = Connections;
