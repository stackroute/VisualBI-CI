angular.module('hotChocolate')
    .factory('user_id', function($http){
      return{
        getUserId: function(uName){
          var req = {
             method: 'POST',
             url: '/getUserId',
             data: {username: uName}
           };
           return $http(req);
        }
      };
    });
