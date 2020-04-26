daystageApp.directive('userProfile', [
    'DateProvider',
    'User',
    '$state',
    '$mdMedia',
    '$mdDialog',
    'DialogHelper',
    '$rootScope',
    '$stateParams',
    '$timeout',
    '$window',
    function(DateProvider, User, $state, $mdMedia, $mdDialog, DialogHelper, $rootScope, $stateParams, $timeout, $window) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_user-profile.html',
            link: function(scope, element, attributes) {


                // console.log('$stateParams', $stateParams);
                scope.activeFilter = $stateParams.activeFilter;
                $stateParams.userId = $stateParams.userId == '' ? 'home' : $stateParams.userId;

                scope.isProfileLoading = true;
                scope.user = {};

                scope.filter = function(filter) {
                    var params = {
                        userId: 'home',
                        from: $state.current.name,
                        activeFilter: filter
                    };

                    if ($stateParams.userId == '') {
                        params.userId = 'home';
                    } else {
                        params.userId = $stateParams.userId;
                    }

                    scope.activeFilter = filter;

                    $state.go('.', params, {notify: false}).then(function() {
                        $timeout(function() {
                            $rootScope.$broadcast('events.user.profile.filterFeed', filter);
                        });
                    });
                };

                $rootScope.userProfileFilter = scope.filter;


                scope.profile = function() {
                    if ($stateParams.userId == 'home' || $state.is('edit-profile') || $state.is('upload-stage')) {
                        User.profile()
                            .then(function(response) {
                                if (response.isSuccess) {
                                    scope.user = response.data;
                                } else {
                                    alert('An error occurred!');
                                }
                            }, function(response) {});
                        scope.showEditButton = true;
                    } else {
                        User.fetchUserInfo($stateParams.userId).then(function(response) {
                            scope.user = response.data;
                        });
                        scope.showEditButton = false;
                    }
                    scope.isProfileLoading = false;
                };

                scope.profile();

                scope.$on('EVENT_USER_PROFILE_UPDATED', function() {
                    scope.profile();
                });

                scope.userEdit = {};
                scope.userOrig = {};

                scope.days = [];
                scope.months = [];
                scope.years = [];

                scope.months = DateProvider.months();
                scope.years = DateProvider.years();
                scope.days = DateProvider.days(scope.userEdit, 'birthDay', scope.userEdit.birthMonth, scope.userEdit.birthYear);
                scope.$watch(['user.birthMonth', 'user.birthYear'], function() {
                    scope.days = DateProvider.days(scope.userEdit, 'birthDay', scope.userEdit.birthMonth, scope.userEdit.birthYear);
                }, true);

                scope.userInfo = function() {
                    User.userInfo()
                        .then(function(response) {
                            if (response.data.status) {
                                scope.userOrig = response.data.data[0];
                                scope.userEdit.firstName = User.getUserInfo().firstName;
                                scope.userEdit.lastName = User.getUserInfo().lastName;
                                scope.userEdit.city = User.getUserInfo().city;
                                scope.userEdit.country = User.getUserInfo().country;
                                var birthDate = new Date(User.getUserInfo().birthdate);
                                scope.userEdit.birthMonth = birthDate.getMonth() || undefined;
                                scope.userEdit.birthDay = birthDate.getDate() || undefined;
                                scope.userEdit.birthYear = birthDate.getFullYear() || undefined;
                                scope.userEdit.profileImage = User.getUserInfo().profileImage;
                                if (scope.userEdit.birthMonth) {
                                    scope.userEdit.birthMonth++;
                                    scope.userEdit.birthMonth = scope.userEdit.birthMonth <= 9 ? '0' + scope.userEdit.birthMonth : scope.userEdit.birthMonth;
                                }
                                scope.userEdit.birthDay = scope.userEdit.birthDay <= 9 ? '0' + scope.userEdit.birthDay : scope.userEdit.birthDay;
                            } else {
                                alert('An error occurred.');
                            }
                        }, function(response) {
                            alert('An error occurred.');
                        });
                };

                scope.editProfile = function() {
                    if (scope.EditProfileForm.$valid) {

                        $rootScope.$broadcast('EVENTS_DIALOG_LOADING');

                        User.updateProfile({
                                firstName: scope.userEdit.firstName,
                                lastName: scope.userEdit.lastName,
                                email: User.getUserInfo().email,
                                gender: User.getUserInfo().gender,
                                city: scope.userEdit.city,
                                country: scope.userEdit.country,
                                status: scope.userOrig.status || 'Active',
                                profileImage: scope.userEdit.profileImage,
                                birthDate: scope.userEdit.birthYear + '-' + scope.userEdit.birthMonth + '-' + scope.userEdit.birthDay,
                                artist: {
                                    performerName: scope.userOrig.artist.performerName,
                                    categories: scope.userOrig.artist.categories,
                                    facebookPageLink: scope.userOrig.artist.facebookPageLink,
                                    phoneNumber: scope.userOrig.artist.phoneNumber,
                                    email: scope.userOrig.artist.email
                                }
                            })
                            .then(function(response) {
                                $rootScope.$broadcast('EVENTS_DIALOG_NOT_LOADING');
                                if (response.data.status) {

                                    if (scope.userEdit.youtubeLink) {
                                        DialogHelper.showBasic(scope, undefined, 'Select YouTube Videos', '<you-tube-videos></you-tube-videos>');
                                    } else {
                                        DialogHelper.showBasic(scope, undefined, 'Success', 'Profile successfully updated.');
                                    }

                                } else {
                                    alert('An error occurred.');
                                }

                            }, function(response) {
                                $rootScope.$broadcast('EVENTS_DIALOG_NOT_LOADING');
                                alert('An error occurred.');
                            });
                    }
                };


            }
        };
    }
]);
