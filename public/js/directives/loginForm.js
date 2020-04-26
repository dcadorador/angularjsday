daystageApp.directive('loginForm', [
    'User',
    function (User) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_loginForm.html',
            link: function (scope, element, attributes) {

                scope.$on('EVENT_USER_LOGGED_IN', function () {
                    scope.userLoggedIn = true;
                });

                scope.$on('EVENT_USER_LOGGED_OUT', function () {
                    scope.userLoggedIn = false;
                });

                scope.login = function () {
                    if (scope.LoginForm.$valid) {
                        var login = User.login(scope.loginForm.email, scope.loginForm.password);
                        login.then(function (response) {

                        }, function (response) {

                        });
                    } else {

                    }
                };

            }
        };
    }
]);
