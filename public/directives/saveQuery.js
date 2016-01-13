var hotChocolate = angular.module("hotChocolate");
hotChocolate.directive('saveQuery', function($http) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function() {
        var colArray = [],
            rowArray = [],
            filterArray = [];
        for(var i=0; i < 2; i++) {
          var dragItems = scope.items[i].list;
          var len = dragItems.length;
          if(len > 0) {
            for(var j=0; j < len; j++) {
              if (i === 0) { colArray.push(dragItems[j]); }
              else { rowArray.push(dragItems[j]); }
            } // inner for loop
          } // end if
        } // end outer for loop
        var parameters = {
          queryName: scope.newQueryName,
          userName: "hotChocolate",
          colArray: colArray,
          rowArray: rowArray,
          filterArray: filterArray,
          queryMDX: scope.mdxQuery,
          connectionData: {
            // xmlaServer: "http://172.23.238.252:8080/pentaho/Xmla?userid=admin&password=password",
            dataSource: scope.$root.DataSourceName,
            catalog: scope.$root.CatalogName,
            cube: scope.$root.CubeName,
          }
        };
        $http.post('/query/new', {
          myString: JSON.stringify(parameters)
        }).success(function(data) {
          scope.showModalAlert = true;
          scope.querySaveMessage = data.info;
          if(data.status=="success")
          {
            scope.queryList.push(scope.newQueryName);
          }

        });
      }); // end click event
    } // end link function
  }; // end return
}); // end directive
