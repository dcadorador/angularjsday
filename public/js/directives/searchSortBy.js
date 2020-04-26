daystageApp.directive('searchSortBy', [
    'SearchService',
    '$timeout',
    function (SearchService, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {

                scope.active = 'stage';

                scope.init = function () {
                    scope.active = SearchService.sortBy;
                };

                scope.$on('events.search.success', function (sender, args) {
                    scope.init();
                });

                scope.$on('events.search.fail', function (sender, args) {
                    scope.init();
                });

                $timeout(function () {
                    scope.init();
                });

            }
        }
    }
]);
