daystageApp.directive('resetPassword', [
    'User',
    'DialogHelper',
    function (User, DialogHelper) {
        return {
            restrict: 'E',
            templateUrl: '../views/partials/_reset-password.html',
            link: function (scope, element, attributes) {

                scope.resetPassword = function () {
                    if (scope.ResetPasswordForm.$valid) {
                        User.changePassword(scope.ResetPassword.password, scope.ResetPassword.passwordRepeat)
                            .then(function (response) {

                                if (response.data.status) {
                                    DialogHelper.showBasic(
                                        scope,
                                        undefined,
                                        'Success',
                                        'Password updated!',
                                        undefined,
                                        undefined,
                                        {width:50}
                                    );
                                } else {

                                    var message = 'An error occured!';
                                    if (response.data.data.internal.token) {
                                        message = 'Token mismatched!';
                                    }
                                    DialogHelper.showBasic(
                                        scope,
                                        undefined,
                                        'Error',
                                        message,
                                        undefined,
                                        undefined,
                                        {width:50}
                                    );
                                }
                            }, function (response) {
                            });
                    }
                };

            }
        }
    }

]);
