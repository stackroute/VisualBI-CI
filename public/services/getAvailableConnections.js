var hotChocolate = angular.module("hotChocolate");
 hotChocolate.factory('getAvailableConnections',
                        function($http) {
                             return {
                               availableConnections: function (uName) {
                                 var parameters = {username: uName};
                                 return $http.get('/serverCredentials/getAvailableConnections',{params: parameters});
                               },
                                activeConnection: function(uName){
                                  // var parameters = {username: uName};
                                  return $http.get('/serverCredentials/getActiveConnection',{params: {username:uName}});
                                }
                             };
                          });
