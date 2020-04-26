daystageApp.directive('stageVideoSideBar', [
    'User',
    'Facebook',
    function (User, Facebook) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_stage-video-side-bar.html',
            link: function (scope, element, attributes) {

                scope.isLoggedIn = User.isLoggedIn();

                scope.share = function () {
                    Facebook.fbShare();
                };
            }
        };
    }
]);
