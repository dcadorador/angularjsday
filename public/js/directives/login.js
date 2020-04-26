/**
 * This is the login header.
 * Todo - refactor, so messy
 */
daystageApp.directive('login', [
    'User',
    'DialogHelper',
    '$timeout',
    '$state',
    '$mdBottomSheet',
    '$rootScope',
    function(User, DialogHelper, $timeout, $state, $mdBottomSheet, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_login.html',
            link: function(scope, element, attributes) {

                scope.User = {};
                scope.errors = [];
                scope.errorHolder = {};
                scope.userLoggingIn = false;
                scope.info = false;

                scope.uploadButtonClick = $rootScope.uploadButtonClick;

                var loadUserInfo = function() {
                    scope.info = User.getUserInfo();
                };

                scope.userLoggedIn = User.isLoggedIn();

                scope.$on('EVENT_USER_TO_ARTIST', function() {
                    User.userInfo();
                });

                scope.$on('EVENT_USER_LOGGED_IN', function() {
                    //scope.userLoggedIn = true;
                    // User.userInfo().then(function (response) {
                    //     loadUserInfo();
                    //     scope.userLoggedIn = true;
                    //     $state.go('home-logged-in');
                    // });
                });

                scope.$on('EVENT_USER_LOGGED_OUT', function() {
                    scope.userLoggedIn = false;
                });

                scope.logout = function() {
                    User.logout();
                };

                scope.$on('EVENT_USER_PROFILE_UPDATED', function() {
                    scope.info = User.getUserInfo();
                });

                scope.$watch('User', function() {
                    scope.errors = [];
                }, true);

                $timeout(function() {
                    loadUserInfo();
                });

                scope.login = function() {

                    if (scope.LoginForm.$valid) {

                        var login = User.login(scope.User.email, scope.User.password);
                        scope.userLoggingIn = true;

                        login.then(function(response) {
                            scope.errors = [];

                            // validation error
                            if (response.data.status == false) {
                                scope.errors.push(response.data.data.internal);
                            }

                            scope.userLoggingIn = false;

                        }, function(response) {
                            scope.errors = [];
                            scope.errors.push(response.data.data.internal);
                        });

                    } else {

                        scope.errorHolder.email = scope.LoginForm.email.$invalid &&
                            (scope.LoginForm.$submitted || scope.LoginForm.email.$touched);
                        scope.errorHolder.password = scope.LoginForm.password.$invalid &&
                            (scope.LoginForm.$submitted || scope.LoginForm.password.$touched);

                    }

                };

                scope.uploadStage = function() {

                    var form = '<upload-stage></upload-stage>';
                    var width = 70;
                    var title = 'Upload Video';

                    //if (User.getUserInfo().type.toLowerCase() == 'user') {
                    //    form = '<artist-signup></artist-signup>';
                    //    width = 50;
                    //    title = 'Artist Registration';
                    //} else {
                    //
                    //}

                    DialogHelper.showBasic(
                        scope,
                        undefined,
                        title,
                        form,
                        undefined, {
                            clickOutsideToClose: false
                        }, {
                            width: width,
                            contentStyle: 'padding:0;'
                        }
                    );

                };

                scope.showUploadBottomSheet = function() {
                    scope.$parent.$parent.uploadBottomSheetVisibility = !scope.$parent.$parent.uploadBottomSheetVisibility;
                };

            }
        };
    }
]);
