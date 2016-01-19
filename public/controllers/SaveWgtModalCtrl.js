hotChocolate.controller('SaveQryModalCtrl',
    function ($scope, $uibModalInstance, $timeout, items, queryList, mdxQuery, saveQuery )
    {
        $scope.items = items;
        $scope.queryList = queryList;
        console.log($scope.queryList);
        $scope.mdxQuery = mdxQuery;
       /*************** What to be done for saving **********/
       $scope.save = function () {
           console.log($scope.items);
           var colArray = $scope.items[0].list.length>0 ? $scope.items[0].list : [];
               rowArray = $scope.items[1].list.length>0 ? $scope.items[1].list : [];
               filterArray = $scope.items[2].list.length>0 ? $scope.items[2].list : [];
           var parameters = {
             queryName: $scope.newQueryName,
             userName: "hotChocolate",
             colArray: colArray,
             rowArray: rowArray,
             filterArray: filterArray,
             queryMDX: $scope.mdxQuery,
             connectionData: {
               // xmlaServer: "http://172.23.238.252:8080/pentaho/Xmla?userid=admin&password=password",
               dataSource: $scope.$root.DataSourceName,
               catalog: $scope.$root.CatalogName,
               cube: $scope.$root.CubeName,
             }
           };
           saveQuery.saveQuery(parameters).success(function(data) {

             console.log(data);
             $scope.showModalAlert = true;
             $timeout(function() {
               $scope.showModalAlert = false;
             }, 2000);
             $scope.querySaveMessage = data.info;
             if(data.status=="success")
             {
               $scope.queryList.push({queryName : $scope.newQueryName});
             }
             console.log($scope.queryList);
             if (data.status === "success"){
               $timeout(function() {
                 $uibModalInstance.close($scope.queryList);
               }, 5000);
             }
           });
       };
       $scope.close = function(){
         $uibModalInstance.close($scope.queryList);
       };
       $scope.cancel = function () {
         $uibModalInstance.dismiss('cancel');
       };

        //  $uibModalInstance.close();
     });

     hotChocolate.controller('SaveWgtModalCtrl',
          function ($scope, $uibModalInstance, $timeout, mdxQuery, saveWidget )
              {
                  $scope.mdxQuery = mdxQuery;
                 /*************** What to be done for saving **********/
                 $scope.save = function () {
                     var parameters = {
                       widgetName: $scope.newWidgetName,
                       userName: "hotChocolate",
                       queryMDX: $scope.mdxQuery,
                       connectionData: {
                         // xmlaServer: "http://172.23.238.252:8080/pentaho/Xmla?userid=admin&password=password",
                         dataSource: $scope.$root.DataSourceName,
                         catalog: $scope.$root.CatalogName,
                         cube: $scope.$root.CubeName,
                       }
                     };
                     saveWidget.saveWidget(parameters).success(function(data) {
                       $scope.showModalAlert = true;
                       $timeout(function() {
                         $scope.showModalAlert = false;
                       }, 2000);
                       $scope.widgetSaveMessage = data.info;
                       // if (data.status === "success"){
                       //   $timeout(function() {
                       //     $uibModalInstance.close($scope.widgetList);
                       //   }, 5000);
                       // }
                     });
                 };
                 $scope.close = function(){
                   $uibModalInstance.close();
                 };
                 $scope.cancel = function () {
                   $uibModalInstance.dismiss('cancel');
                 };
               });
