var mongoose = require('mongoose');

var ConnectionsSchema = mongoose.Schema({
  connectionName: String,
  serverURL: String,
  userid: String,
  password: String,
  savedQueries: [{
    queryName: {type: String},
    // createdBy: String,
    createdOn: Date,
    modifiedOn: {type: Date, default: Date.now},
    onMeasures: [{
                unique_name: String,
                caption_name: String,
                isMember: String
               }],
    onColumns: [{
                unique_name: String,
                caption_name: String,
                hierName: String,
                levelIdx: Number,
                isMember: String
               }],
    onRows: [{
             unique_name: String,
             caption_name: String,
             hierName: String,
             levelIdx: Number,
             isMember: String
            }],
    onFilters: [{
                unique_name: String,
                caption_name: String,
                hierName: String,
                levelIdx: Number,
                isMember: String
               }],
    queryMDX: String,
    connectionData: {
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
