var hotChocolate = angular.module('hotChocolate');
hotChocolate.controller('SaveWgtModalCtrl',
    function ($scope, $rootScope, $uibModalInstance, $timeout, mdxQuery, widget )
    {
      var uName = 'hotChocolate';
        $scope.mdxQuery = mdxQuery;
        $scope.newWidgetName = "";
        $scope.existingWidgetName = "";
        $scope.isWidgetExists = false;
        $scope.saveOption = "update";
        $scope.widgetMessage = "";
        widget.getSavedWidgets(uName).success(function(data){
          $scope.widgetList = data;
        })
        $scope.isRadioSelected = function(val) {
          return val === $scope.saveOption;
    };

       /*************** On save **********/
   $scope.save = function () {
     var connId = $rootScope.connId;
     if($scope.saveOption === "add"){
         if($scope.newWidgetName === ""){
             $scope.widgetMessage = "Widget name cannot be empty";
             $scope.isWidgetExists = true;
             $timeout(function() {
               $scope.widgetMessage ="";
               $scope.isWidgetExists = false;
             }, 2000);
         }
         else{
            var widgetList = $scope.widgetList;
            var widgetName = $scope.newWidgetName;
            var isExists = false;
            for(widgetIdx in widgetList){
              if (widgetList[widgetIdx].widgetName === widgetName)
               {
                  isExists = true;
                  break;
               }
            }//end of for loop;
            if(isExists){
                $scope.isWidgetExists = true;
                $scope.widgetMessage = "Already widget exists";
                $timeout(function() {
                  $scope.widgetMessage ="";
                  $scope.isWidgetExists = false;
                }, 2000);
              }
            //Widget name is new
            else{
              var addParameters = {
                  newWidgetName: $scope.newWidgetName,
                  userName: "hotChocolate",
                  queryMDX: $scope.mdxQuery,
                  description: $scope.description,
                  connectionData: {
                    connectionId: connId,
                    dataSource: $scope.$root.DataSourceName,
                    catalog: $scope.$root.CatalogName,
                    cube: $scope.$root.CubeName
                  }
              };
              widget.saveWidget(addParameters)
                .success(function(data) {
                    $scope.isWidgetExists = true;
                    $scope.widgetMessage = data.info;
                    $timeout(function() {
                      $scope.widgetMessage = "";
                      $scope.isWidgetExists = false;
                    }, 2000);
                    if (data.status === "success"){
                      $scope.widgetList.push(data.widget);
                      $timeout(function() {
                        $uibModalInstance.close($scope.widgetList);
                        $scope.isWidgetExists = false;
                      }, 2000);
                    }
                });
            }
         } //else of non empty name;
     }
     else{
       if($scope.existingWidgetName === ""){
           $scope.widgetMessage = "Please enter an existing widget name";
           $scope.isWidgetExists = true;
           $timeout(function() {
             $scope.widgetMessage ="";
             $scope.isWidgetExists = false;
           }, 2000);
       }
       //entered a non-empty name in widgetName
       else{
         var widgetList = $scope.widgetList;
         var widgetName = $scope.existingWidgetName;
         var isExists = false;
         for(widgetIdx in widgetList){
            if (widgetList[widgetIdx].widgetName === widgetName)
             {
                isExists = true;
                break;
             }
         }//end of for loop;
          if (isExists){
            var updateParameters = {
              existingWidgetName: $scope.existingWidgetName,
              userName: "hotChocolate",
              queryMDX: $scope.mdxQuery,
              description: $scope.description,
              connectionData: {
                connectionId: connId,
                dataSource: $scope.$root.DataSourceName,
                catalog: $scope.$root.CatalogName,
                cube: $scope.$root.CubeName,
              }
            };
            widget.updateWidget(updateParameters).success(function(data){
              $scope.widgetMessage = data.info;
              $scope.isWidgetExists = true;
              $timeout(function() {
                $scope.widgetMessage = "";
                $scope.isWidgetExists = false;
              }, 2000);
              if (data.status === "success"){
                $timeout(function() {
                  $uibModalInstance.close($scope.widgetList);
                  $scope.isWidgetExists = false;
                }, 2000);
              }
            })
          }//end of if selected widget exists
          //selected widget doent exist
          else{
            $scope.isWidgetExists = true;
            $scope.widgetMessage = "No such widget exists.Please enter an available widget";
            $timeout(function() {
              $scope.widgetMessage ="";
              $scope.isWidgetExists = false;
            }, 2000);
          }//end of no_widget exists
       }
     }//end of saveOption === "update"
   };
   $scope.getDescription = function(){
      var widgetList = $scope.widgetList,
          widgetName = $scope.existingWidgetName;
      $scope.isWidgetExists = false;
      $scope.description = "";
      for(widgetIdx in widgetList){
         if (widgetList[widgetIdx].widgetName === widgetName)
          {
            if($scope.saveOption === "update"){
              $scope.description = widgetList[widgetIdx].description;
              break;
            }
          }
       }
   }
   $scope.close = function(){
     $uibModalInstance.close();
   };
   $scope.cancel = function () {
     $uibModalInstance.dismiss('cancel');
   };
 });
