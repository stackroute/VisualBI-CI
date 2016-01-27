angular.module('hotChocolate')
  .filter('slug', function () {
    return function (input) {
      if (input) {
        return input.replace(/ /g,"_");
      }
    };
  });
