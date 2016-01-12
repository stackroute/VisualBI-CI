var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('saveConnection',
                      function($http) {
                           return {
                             saveConnection: function (conn) {
                               var parameters= {
                                 username: 'hotChocolate',
                                 connection_id: conn._id
                               };
                               var req = {
                                  method: 'POST',
                                  url: '/serverCredentials/save',
                                  data: parameters
                                };
                               return $http(req);
                             }
                           };
                        });
