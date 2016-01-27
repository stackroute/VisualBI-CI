/*
   * Copyright 2016 NIIT Ltd, Wipro Ltd.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * Contributors:
   *
   * 1. Abhilash Kumbhum
   * 2. Anurag Kankanala
   * 3. Bharath Jaina
   * 4. Digvijay Singam
   * 5. Sravani Sanagavarapu
   * 6. Vipul Kumar
*/

hotChocolate.controller('SaveQryModalCtrl',
    function ($scope, $rootScope, $uibModalInstance, $timeout, items, queryList, mdxQuery, query )
    {
        $scope.items = items;
        $scope.queryList = queryList;
        $scope.mdxQuery = mdxQuery;
       /*************** What to be done for saving **********/
       $scope.save = function () {
           var measureArray = $scope.items[0].list.length>0 ? $scope.items[0].list : [];
               colArray = $scope.items[1].list.length>0 ? $scope.items[1].list : [];
               rowArray = $scope.items[2].list.length>0 ? $scope.items[2].list : [];
               filterArray = $scope.items[3].list.length>0 ? $scope.items[3].list : [];
           var parameters = {
             queryName: $scope.newQueryName,
             userName: $rootScope.userName,
             onMeasures: measureArray,
             onColumns: colArray,
             onRows: rowArray,
             onFilters: filterArray,
             queryMDX: $scope.mdxQuery,
             connectionData: {
               dataSource: $scope.$root.DataSourceName,
               catalog: $scope.$root.CatalogName,
               cube: $scope.$root.CubeName,
             }
           };
           var connId = $rootScope.connId;
           query.saveQuery(parameters, connId).success(function(data) {
             $scope.showModalAlert = true;
             $timeout(function() {
               $scope.showModalAlert = false;
             }, 2000);
             $scope.querySaveMessage = data.info;
             if(data.status=="success")
             {
               $scope.queryList.push(data.query);
             }
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
     });
