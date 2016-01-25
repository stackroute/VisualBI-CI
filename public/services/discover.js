var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('discover',function($http) {
  var factory = {};
  factory.getSource= function (path, connId) {
     var parameters= {
       connId: connId,
       pathName: path
     };
     return $http.get('/discover/getServerDetails', {params: parameters});
   };
   factory.getDimensions= function (path,connId) {
      var parameters= {
        connId: connId,
        pathName: path
      };
      return $http.get('/discover/getDimensions', {params: parameters});
    };
    factory.getMeasures= function (path,connId) {
       var parameters= {
         connId: connId,
         pathName: path
       };
       return $http.get('/discover/getMeasures', {params: parameters});
     };
   return factory;
  });
