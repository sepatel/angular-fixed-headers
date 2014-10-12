(function(angular) {
  angular.module("ngFixedHeaders", []).directive("fixedHeaders", ['$timeout', '$window', function($timeout, $window) {
    return {
      restrict: 'EA',
      replace: false,
      scope: {
        rows: '=watch'
      },
      transclude: true,
      template: '<div><div class="fixedHeader" style="white-space: nowrap; position: absolute;"></div><div ng-transclude></div></div>',
      link: function(scope, elem, attr, ctrl) {
        function initialize() {
          $timeout(function() {
            var table = elem.find("table").one();
            var thead = table.find("thead").one();
            var tr = thead.find("tr").one();

            thead.height(thead.outerHeight());

            var headerDiv = elem.find("div.fixedHeader").one();
            headerDiv.empty();
            console.info("headerDiv is ", headerDiv);
            headerDiv.width(thead.innerWidth());
            headerDiv.height(thead.innerHeight());
            headerDiv.css('background-color', tr.css('background-color'));

            // wrap the the contents of th for ease of use
            tr.find("th").filter(":not(span.fixedHeaderWrapping)").each(function(index, th) {
              th = angular.element(th);
              if (th.find("span.fixedHeaderWrapping").length == 0) {
                th.wrapInner('<span class="fixedHeaderWrapping">');
              }
            });

            tr.find("th").each(function(index, th) {
              th = angular.element(th);
              var wrapping = th.find("span.fixedHeaderWrapping").one();
              var span = wrapping.clone(true);
              span.width(th.outerWidth()).height(th.outerHeight()).css('display', 'inline-block').css('white-space', th.css('white-space'));
              angular.forEach(['top', 'bottom', 'left', 'right'], function(direction) {
                span.css('padding-' + direction, th.css('padding-' + direction));
                span.css('margin-' + direction, th.css('margin-' + direction));
                span.css('border-' + direction, th.css('border-' + direction));
              });
              headerDiv.append(span);
            });
          });
        }

        angular.element($window).bind('resize', initialize);

        scope.$watch('rows', initialize, true);
      }
    }
  }]);
}(angular));

