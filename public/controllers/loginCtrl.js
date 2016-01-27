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

angular.module("login")
  .controller("loginCtrl",function($scope, $cookies, $http, $window, login){
    $scope.isRegSelected = false;
    $scope.loginMsg = "";
    $scope.putCookie = function(){
      var parameters = {
        username: $scope.userName,
        password: $scope.password
      };
      login.authenticate(parameters).then(function(data){
        $scope.loginMsg = "";
        $window.location.href = '/home';
        $cookies.put('userName', $scope.userName);
      }, function(error){
        $scope.loginMsg = "Authentication Failed !!!";
        $scope.userName = "";
        $scope.password = "";
        $cookies.put('userName', undefined);
      });
    };
    $scope.showRegisterForm = function(){
      $scope.isRegSelected = !$scope.isRegSelected;
      $scope.loginMsg = "";
            $scope.userName = "";
            $scope.password = "";
      $scope.userNameExist = false;
    };
  });
