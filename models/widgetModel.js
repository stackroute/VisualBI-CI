var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var widgetSchema = new schema({
  widgetName      : String,
  createdBy       : String,
  createdOn       : Date,
  modifiedOn      :  Date,
  queryMDX        : String,
  description     : String,
  connectionData  : {
                       connectionId : {type: schema.Types.ObjectId},
                       dataSource: String,
                       catalog: String,
                       cube: String
                    },
   widgetSlug      : String
});
var widget = mongoose.model('Widget', widgetSchema);
module.exports = widget;
