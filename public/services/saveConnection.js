var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('saveConnection',function($http) {
     return {
       saveConnection: function (userName, conn) {
         var parameters= {
           username: userName,
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
