var hotChocolate = angular.module("hotChocolate");
// hotChocolate.service('addNewConnection',
//                       function($http) {
//                           this.addNewConnection = function(newConn){
//                           var parameters= {
//                             username: 'hotChocolate',
//                             connName : newConn.connName,
//                             url      : newConn.url,
//                             userid   : newConn.userid,
//                             password : newConn.password
//                           };
//                           $http.get('/serverCredentials/addConnection', {params: parameters}).then(function(data){console.log(data);},
//                           function(error){console.log(error);});
//                         };
//                        });
hotChocolate.factory('addNewConnection',
                     function($http) {
                       return{
                         addNewConnection: function (newConn) {
                            var parameters= {
                              username: 'hotChocolate',
                              connName : newConn.connName,
                              url      : newConn.url,
                              userid   : newConn.userid,
                              password : newConn.password
                            };
                            return $http.get('/serverCredentials/addConnection', {params: parameters});
                          }
                        };
                      });
