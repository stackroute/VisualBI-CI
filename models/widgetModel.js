var mongoose = require('mongoose');

var widgetSchema = new mongoose.Schema({
  widgetName: {type: String, unique: true},
  createdBy: String,
  createdOn: Date,
  modifiedOn: {type: Date, default: Date.now},
  queryMDX: String,
  connectionData: {
                   dataSource: String,
                   catalog: String,
                   cube: String
                  }
});

module.exports = mongoose.model('Widget', widgetSchema);
