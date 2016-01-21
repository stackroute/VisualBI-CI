var hotChocolate = angular.module("login");
hotChocolate.factory('login',
                      function($http) {
                           return {
                             authenticate: function (parameters) {
                               var req = {
                                  method: 'POST',
                                  url: '/login',
                                  data: parameters
                                };
                               return $http(req);
                             }
                           };
                        });
