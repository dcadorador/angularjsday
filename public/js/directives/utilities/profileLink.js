daystageApp.directive('profileLink', [
    '$rootScope',
    '$state',
    'User',
    'DialogHelper',
    '$timeout',
    function($rootScope, $state, User, DialogHelper, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                element.css('cursor', 'pointer');

                element.bind('click', function() {
                    if (!User.isLoggedIn()) {
                        DialogHelper.showAdvanced(scope, undefined, './views/partials/_hiredialogGuest.html');
                        return;
                    }

                    $state.go('user-profile', {
                        userId: attributes.profileLink == User.getUserId() ? 'home' : attributes.profileLink,
                        activeFilter: 'user'
                    }, {
                        location: true,
                        reload: true,
                        notify: true
                    });

                    $timeout(function() {
                        $rootScope.$broadcast('events.user.profile.filterFeed', 'user');
                    });
                });

            }
        };
    }
]);
