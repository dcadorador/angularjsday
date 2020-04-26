daystageApp.directive('stageVideo', [
    '$timeout',
    '$rootScope',
    'User',
    function ($timeout, $rootScope, User) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {

                $timeout(function (response) {

                    scope.video = element[0];
                    scope.viewed = false;
                    var viewStageInSeconds = 2;

                    scope.video.addEventListener('timeupdate', function (event) {

                        if (User.isLoggedIn()) {

                            // If user has watched over 3 seconds
                            if (scope.video.currentTime >= viewStageInSeconds) {
                                if (!scope.viewed) {
                                    User.viewStage(attributes.stageVideo);
                                    scope.viewed = true;
                                    $rootScope.$broadcast('events.stage.video.viewed', attributes.stageVideo);
                                }
                            }

                        }

                    });

                    scope.video.addEventListener('ended', function (event) {

                        if (User.isLoggedIn()) {

                            if (scope.video.duration < viewStageInSeconds) {
                                if (!scope.viewed) {
                                    User.viewStage(attributes.stageVideo);
                                    scope.viewed = true;
                                    $rootScope.$broadcast('events.stage.video.viewed', attributes.stageVideo);
                                }
                            }

                        }

                    });

                    scope.video.addEventListener('contextmenu', function (e) {
                        e.preventDefault();
                    });

                });

            }
        };
    }
]);
