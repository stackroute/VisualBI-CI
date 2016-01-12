var hotChocolate = angular.module("hotChocolate");
 hotChocolate.factory('getAvailableConnections',
                        function($http) {
                             return {
                               availableConnections: function () {
                                 var parameters = {username: 'hotChocolate'};
                                 return $http.get('/serverCredentials/getAvailableConnections',{params: parameters});
                               }
                             };
                          });
