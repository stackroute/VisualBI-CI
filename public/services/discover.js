var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('discover',
                      function($http) {
                        var factory = {};
                        factory.getSource= function (path) {
                           var parameters= {
                             username: 'hotChocolate',
                             pathName: path
                           };
                           return $http.get('/discover/getServerDetails', {params: parameters});
                         };
                         factory.getDimensions= function (path) {
                            var parameters= {
                              username: 'hotChocolate',
                              pathName: path
                            };
                            return $http.get('/discover/getDimensions', {params: parameters});
                          };
                          factory.getMeasures= function (path) {
                             var parameters= {
                               username: 'hotChocolate',
                               pathName: path
                             };
                             return $http.get('/discover/getMeasures', {params: parameters});
                           };
                         return factory;
                        });
