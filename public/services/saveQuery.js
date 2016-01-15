var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('saveQuery',
                      function($http) {
                           return {
                             saveQuery: function (parameters, connId) {
                               var params = {};
                               params.parameters = parameters;
                               params.connId = connId;
                               console.log(params);
                               var req = {
                                  method: 'POST',
                                  url: '/query/new',
                                  data: {parameter: JSON.stringify(params)}
                                };
                               return $http(req);
                             }
                           };
                        });
