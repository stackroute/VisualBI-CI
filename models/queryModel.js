var mongoose = require('mongoose');

var querySchema = new mongoose.Schema({
  queryName: {type: String, unique: true},
  createdBy: String,
  createdOn: Date,
  modifiedOn: {type: Date, default: Date.now},
  onColumns: [String],
  onRows: [String],
  onFilters: [String],
  queryMDX: String
});

querySchema.statics.findByUserName = function (userName, callback) {
  this.find(
    { createdBy: userName },
    '_id queryName',
    {sort: 'modifiedOn'},
    callback);
}

module.exports = mongoose.model('Query', querySchema);
