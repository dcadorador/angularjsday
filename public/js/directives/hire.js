daystageApp.directive('hire', [
    'User',
    'DialogHelper',
    '$timeout',
    function (User, DialogHelper, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {

                scope.hire = function () {

                    if (!User.isLoggedIn()) {
                        DialogHelper.showAdvanced(scope, undefined, './views/partials/_hiredialogGuest.html')
                    } else {
                        DialogHelper.showAdvanced(scope, [
                            '$scope',
                            '$mdDialog',
                            function ($scope, $mdDialog) {

                                $scope.cancel = function () {
                                    $mdDialog.cancel();
                                };

                                $timeout(function () {
                                    User.fetchUserInfo(User.getUserId()).then(function (response) {
                                        if (response.isSuccess) {
                                            $scope.employer = response.data;
                                        } else {
                                            DialogHelper.inform('Error', 'An error occurred. Please try again');
                                        }
                                        return response;
                                    }).then(function (response) {
                                        User.fetchUserInfo(attributes.hire).then(function (response) {
                                            $scope.employee = response.data;
                                        });
                                    });
                                });

                            }
                        ], './views/partials/_hiredialog.html')
                    }

                };

                element.bind('click', function () {
                    scope.hire();
                });

                scope.$watch(function () {
                    return attributes.hire;
                }, function () {
                    if (attributes.hire == User.getUserId())
                        element.hide();
                    else
                        element.show();
                });

                $timeout(function() {
                    if (attributes.hire == User.getUserId())
                        element.hide();
                });

            }
        };
    }
]);
