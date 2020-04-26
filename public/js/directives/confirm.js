daystageApp.directive("confirm", [
    '$stateParams',
    '$timeout',
    'User',
    function ($stateParams, $timeout, User) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_confirm.html',
            replace: true,
            link: function (scope, element, attributes) {

                scope.confirmed = false;
                scope.error = '';

                $timeout(function () {
                    User.confirm($stateParams.token).then(function (response) {
                        if (response.data.status) {
                            scope.confirmed = true;
                        } else {
                            scope.error = response.data.data.internal.token[0];
                        }
                    });
                });

            }
        };
    }
]);
