var app = angular.module("hotChocolate");
app.factory('user_id', function($http){
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
