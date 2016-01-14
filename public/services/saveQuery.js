var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('saveQuery',
                      function($http) {
                           return {
                             saveQuery: function (parameters) {
                               var req = {
                                  method: 'POST',
                                  url: '/query/new',
                                  data: {parameter: JSON.stringify(parameters)}
                                };
                               return $http(req);
                             }
                           };
                        });
