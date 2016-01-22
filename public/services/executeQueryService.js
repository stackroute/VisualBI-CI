var app = angular.module('hotChocolate');

app.factory('executeQueryService', function($http, $rootScope) {
  return {
    executeQuery: function (mdxQuery) {
       var parameters= {
         connId : $rootScope.connId,
         dataSource: $rootScope.DataSourceName,
         catalog: $rootScope.CatalogName,
         statement: mdxQuery
       };
       var req = {
          method: 'POST',
          url: '/execute',
          data: parameters
        };
       return $http(req);
    }
  };
});
