var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('addNewConnection',
                     function($http) {
                       return{
                         addNewConnection: function (userName, newConn) {
                            var parameters= {
                              username: userName,
                              connName : newConn.connName,
                              url      : newConn.url,
                              userid   : newConn.userid,
                              password : newConn.password
                            };
                            return $http.get('/serverCredentials/addConnection', {params: parameters});
                          }
                        };
                      });
