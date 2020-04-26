daystageApp.directive('follow', [
    'DialogHelper',
    '$timeout',
    'User',
    function (DialogHelper, $timeout, User) {
        return {
            restrict: 'E',
            replace: true,
            scope: {user: '='},
            template: '<button class="btn winner-button btn-follow">Follow</button>',
            link: function (scope, element, attributes) {

                scope.init = function () {

                    if (!scope.user)
                        return;

                    if (scope.user.id == User.getUserId()) {
                        element.hide();
                    }else{
                        element.show();
                    }

                    if (scope.user.followed) {
                        element.text('Un-follow');
                    }

                    element.unbind('click').bind('click', function () {

                        if (!User.isLoggedIn()) {
                            DialogHelper.showAdvanced(scope, undefined, './views/partials/_hiredialogGuest.html');
                            return false;
                        }

                        var action = (scope.user.followed ? 'unFollow' : 'follow');

                        User[action](scope.user.id).then(function (response) {
                            if (response.data.status) {
                                scope.user.followed = (action == 'follow');
                                element.text((action == 'follow' ? 'Un-follow' : 'Follow'));
                            } else {
                                DialogHelper.inform('Error', response.data.data.internal);
                            }
                        });

                    });
                };

                $timeout(function () {
                    scope.init();
                });

                scope.$watch('user.id', function () {
                    scope.init();
                });

            }
        };
    }
]);
