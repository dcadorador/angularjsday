daystageApp.directive('searchType', [
    'SearchService',
    '$timeout',
    function (SearchService, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {

                scope.active = 'stage';

                var init = function () {
                    scope.active = SearchService.type;
                };

                scope.$on('events.search.success', function (sender, args) {
                    init();
                });

                scope.$on('events.search.fail', function (sender, args) {
                    init();
                });

                $timeout(function () {
                    init();
                });

            }
        }
    }
]);
