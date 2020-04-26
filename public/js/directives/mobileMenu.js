daystageApp.directive("mobileMenu", [
    'User',
    '$timeout',
    function (User, $timeout) {
        return {
            restrict: 'E',
            scope: { info:"=" },
            templateUrl: "./views/partials/_mobileMenu.html",
            link: function (scope, element, attributes) {

                scope.user = false;

                var loadUserInfo = function () {
                    scope.user = User.getUserInfo();
                };

                scope.$on('EVENT_USER_LOGGED_IN', function () {
                    loadUserInfo();
                });

                $timeout(function () {
                    loadUserInfo();
                });

                scope.logout = function () {
                    User.logout();
                };

            }
        };
    }
]);
