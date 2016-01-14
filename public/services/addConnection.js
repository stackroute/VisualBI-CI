var hotChocolate = angular.module("hotChocolate");
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
