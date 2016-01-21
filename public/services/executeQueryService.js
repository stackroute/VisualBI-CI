var app = angular.module('hotChocolate');

app.factory('executeQueryService', function($http, $rootScope) {
  return {
    executeQuery: function (mdxQuery) {
       var parameters= {
         username : "hotChocolate",
         dataSource: $rootScope.DataSourceName,
         catalog: $rootScope.CatalogName,
         statement: mdxQuery
       };
       return $http.post('/execute', parameters);
    }
  };
});
