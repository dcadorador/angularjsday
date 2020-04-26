daystageApp.directive('btnApplause', [
    'User',
    'DialogHelper',
    '$timeout',
    function (User, DialogHelper, $timeout) {
        return {
            restrict: 'E',
            scope: { stage: '=' },
            template: '<button class="btn btn-applause-control" ng-disabled="applauseToggling" ng-class="{ \'applauded\': stage.isApplauded }">{{ stage.applauseCount }}</button>',
            link: function (scope, element, attributes) {

                scope.applauseToggling = false;

                scope.applause = function () {

                    if (!User.isLoggedIn()) {
                        DialogHelper.showAdvanced(scope, undefined, './views/partials/_hiredialogGuest.html');
                        return false;
                    }

                    scope.applauseToggling = true;
                    User.applause(scope.stage.id).then(function (response) {
                        // scope.stage.isApplauded = true;
                        // scope.stage.applauseCount++;
                        scope.applauseToggling = false;
                    });
                };

                scope.removeApplause = function () {
                    scope.applauseToggling = true;
                    User.removeApplause(scope.stage.id).then(function (response) {
                        // scope.stage.isApplauded = false;
                        // scope.stage.applauseCount--;
                        scope.applauseToggling = false;
                    });
                };

                $timeout(function () {
                    element.find('button').bind('click', function () {
                        if (scope.stage.isApplauded) {
                            scope.removeApplause();
                        } else {
                            scope.applause();
                        }
                    });
                });

            }
        };
    }
]);
