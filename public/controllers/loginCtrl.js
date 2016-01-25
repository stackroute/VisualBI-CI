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
      $scope.userNameExist = false;
    };
  });
