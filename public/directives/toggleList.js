var hotChocolate = angular.module("hotChocolate");
hotChocolate.directive('toggleList', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function() {
        $this = $(this).children('span');
          $this.parent().parent().children('ul.nav-left-ml').toggle(200);
          var cs = $this.attr("class");
          if(cs == 'nav-toggle-icon glyphicon glyphicon-chevron-right') {
            $this.removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
          }
          if(cs == 'nav-toggle-icon glyphicon glyphicon-chevron-down') {
            $this.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
          }
      });
    } // end link function
  }; // end return
}); // toggleList directive end
