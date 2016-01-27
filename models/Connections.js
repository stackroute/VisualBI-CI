/*
   * Copyright 2016 NIIT Ltd, Wipro Ltd.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * Contributors:
   *
   * 1. Abhilash Kumbhum
   * 2. Anurag Kankanala
   * 3. Bharath Jaina
   * 4. Digvijay Singam
   * 5. Sravani Sanagavarapu
   * 6. Vipul Kumar
*/

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
