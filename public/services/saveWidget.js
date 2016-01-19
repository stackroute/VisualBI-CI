var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('saveWidget',
                      function($http) {
                           return {
                             saveWidget: function (parameters) {
                               var req = {
                                  method: 'POST',
                                  url: '/widget/new',
                                  data: {parameter: JSON.stringify(parameters)}
                                };
                               return $http(req);
                             }
                           };
                        });
