/**
 * signUp Directive
 *
 * The Sign Up Form
 */
daystageApp.directive('signUp', [
    '$rootScope',
    'User',
    '$mdDialog',
    'ServerErrorProvider',
    'DateProvider',
    'DialogHelper',
    '$state',
    '$timeout',
    function($rootScope, User, $mdDialog, ServerErrorProvider, DateProvider, DialogHelper, $state, $timeout) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_signup.html',
            link: function(scope, element, attributes) {
                scope.newUser = {};
                scope.errors = [];
                scope.errorHolder = {};

                scope.$on('EVENTS_SIGNUP', function() {
                    User.login(scope.newUser.email, scope.newUser.password);
                });

                scope.$on('EVENT_FACEBOOK_UNVERIFIED', function(sender, data) {

                    if (!$rootScope.isDesktopMode) {
                        $state.go('signup');
                        $timeout(function() {
                            $rootScope.$broadcast('EVENT_FACEBOOK_UNVERIFIED', data);
                        }, 1000);
                    }

                    scope.newUser.firstName = data.firstName;
                    scope.newUser.lastName = data.lastName;

                });

                scope.signUp = function() {

                    if (scope.SignUpForm.$valid && scope.newUser.sex && scope.newUser.birthYear &&
                        scope.newUser.birthDay && scope.newUser.birthMonth) {
                        scope.signingUp = true;
                        User.signUp(
                                scope.newUser.firstName,
                                scope.newUser.lastName,
                                scope.newUser.email,
                                scope.newUser.password,
                                scope.newUser.birthYear + '-' + scope.newUser.birthMonth + '-' + scope.newUser.birthDay,
                                scope.newUser.sex
                            )
                            .then(function(response) {

                                if (response.data.status == false) {
                                    DialogHelper.showBasic(scope, undefined, 'Error',
                                        '<p><strong>Oops!</strong> something went wrong</p>' +
                                        '<p>' + ServerErrorProvider(response.data.data.internal) + '</p>' +
                                        '<button class="btn btn-yellow btn-lg" ng-click="cancel()">Ok</button>',
                                        undefined, undefined, {
                                            width: 50
                                        });
                                } else {
                                    DialogHelper.showBasic(
                                        scope,
                                        undefined,
                                        'Success',
                                        '<p>Thank you for registering to Daystage!</p>' +
                                        '<button class="btn btn-yellow btn-lg" ng-click="ok()">Ok</button>', [
                                            '$scope',
                                            '$mdDialog',
                                            '$rootScope',
                                            function($scope, $mdDialog, $rootScope) {
                                                $scope.ok = function() {
                                                    $mdDialog.hide();
                                                    $rootScope.$broadcast('EVENTS_SIGNUP');
                                                };
                                            }
                                        ],
                                        undefined, {
                                            width: 50
                                        }
                                    );
                                }

                                scope.signingUp = false;
                            }, function(response) {
                                scope.errors = ServerErrorProvider(response.data.data.internal);
                                scope.signingUp = false;
                            });
                    }
                };

                scope.months = [];
                scope.days = [];
                scope.years = [];

                scope.months = DateProvider.months();
                scope.years = DateProvider.years();
                scope.days = DateProvider.days(scope.newUser, 'birthDay', scope.newUser.birthMonth, scope.newUser.birthYear);
                scope.$watch(['newUser.birthMonth', 'newUser.birthYear'], function() {
                    scope.days = DateProvider.days(scope.newUser, 'birthDay', scope.newUser.birthMonth, scope.newUser.birthYear);
                }, true);

            }
        };
    }
]);
