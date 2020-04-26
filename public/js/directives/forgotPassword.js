daystageApp.directive('forgotPassword', [
    'User',
    'DialogHelper',
    function (User, DialogHelper) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_forgot-password.html',
            link: function (scope, element, attributes) {
                scope.User = {};
                scope.isLoading = false;

                scope.forgotPassword = function () {

                    if (scope.ResetPasswordForm.$valid) {
                        scope.isLoading = true;

                        User.forgotPassword(scope.User.email).then(function (response) {
                            scope.isLoading = false;
                            if (response.data.status) {
                                DialogHelper.showBasic(
                                    scope,
                                    undefined,
                                    'Success',
                                    'Please check your email.',
                                    undefined,
                                    undefined,
                                    {width:50}
                                );
                            } else {
                                DialogHelper.showBasic(
                                    scope,
                                    undefined,
                                    'Error',
                                    'No user is associated with this email.',
                                    undefined,
                                    undefined,
                                    {width:50}
                                );
                            }
                        });
                    }
                };

            }
        };
    }
]);
