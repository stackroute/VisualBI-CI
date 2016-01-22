var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('query',
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
                             },
                             getSavedQueries: function (connId) {
                               var req = {
                                  method: 'GET',
                                  url: '/query/byUser/byConn',
                                  data: {connId: connId}
                                };
                               return $http(req);
                             }
                           };
                        });
