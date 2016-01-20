var mongoose = require('mongoose');
  schema = mongoose.Schema;

var widgetSchema = new schema({
  widgetName: {type: String},
  createdBy: String,
  createdOn: Date,
  modifiedOn: {type: Date},
  queryMDX: String,
  connectionData: {
                   connectionId : {type: schema.Types.ObjectId},
                   dataSource: String,
                   catalog: String,
                   cube: String
                  }
});
widgetSchema.pre('save', function(next) {
    this.model('Widget').find(
      {
        widgetName : this.widgetName,
        createdBy : this.createdBy
      },
      function(err, widget){
        if (err){
          next(err);
        }
        if(!widget.length)
          {
            next();
          }
        else {
               next(new Error('already present'));
            }
      })

});
var widget = mongoose.model('Widget', widgetSchema);
module.exports = widget;
