var hotChocolate = angular.module("hotChocolate");
hotChocolate.factory('widget',function($http) {
     return {
       saveWidget: function (addParameters) {
         var req = {
                      method: 'POST',
                      url: '/widget/new',
                      data: {parameter: JSON.stringify(addParameters)}
                   };
         return $http(req);
       },
       updateWidget: function (updateParameters) {
         var req = {
                      method: 'POST',
                      url: '/widget/update',
                      data: {parameter: JSON.stringify(updateParameters)}
                   };
         return $http(req);
       },
       getSavedWidgets: function (userName) {
         var parameters = {username: userName};
         return $http.get('/widget/getSavedWidgets',{params: parameters});
       }
     };
  });
