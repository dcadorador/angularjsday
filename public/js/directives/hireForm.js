daystageApp.directive('hireForm', [
    'User',
    'DialogHelper',
    function (User, DialogHelper) {
        return {
            restrict: 'E',
            scope: {
                employer: '=',
                employee: '='
            },
            templateUrl: './views/partials/_hire.html',
            link: function (scope, element, attributes) {

                scope.hire = function () {

                    User.hireUser(scope.employee.id, scope.user.phone, scope.user.description).then(function (response) {
                        DialogHelper.showAdvanced(scope, [
                            '$scope',
                            '$mdDialog',
                            function ($scope, $mdDialog) {

                                $scope.cancel = function () {
                                    $mdDialog.cancel();
                                };

                                $scope.employerFirstName = User.getUserInfo().firstName;
                                $scope.employeeFirstName = scope.employee.firstName;
                                $scope.employeeLastName = scope.employee.lastName;
                                $scope.employeeDescription = scope.user.description;

                            }
                        ], './views/partials/_hireDialogSuccess.html');

                    }, function (response) {
                        DialogHelper.showAdvanced(scope, [
                            '$scope',
                            '$mdDialog',
                            function ($scope, $mdDialog) {

                                $scope.cancel = function () {
                                    $mdDialog.cancel();
                                };

                                $scope.previousHire = response.data;
                                $scope.currentUser = User.getUserInfo();

                            }
                        ], './views/partials/_hireDialogError.html');
                    });
                };

            }
        };
    }
]);
