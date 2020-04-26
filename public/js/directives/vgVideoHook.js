daystageApp.directive('vgVideoHook', [
    'User',
    '$rootScope',
    function (User, $rootScope) {
        return {
            restrict: 'E',
            require: '^videogular',
            scope: { stage: '=' },
            link: function (scope, element, attributes, API) {

                scope.$watch(
                    function () {
                        return API.currentTime;
                    },
                    function (newVal, oldVal) {

                        if (typeof scope.stage == 'undefined' || scope.stage.viewed == true)
                            return;

                        if (newVal >= 5000 || newVal >= API.totalTime && API.totalTime != 0) {
                            scope.stage.viewed = true;
                            scope.stage.viewStage().then(function (response) {
                                $rootScope.$broadcast('events.stage.video.viewed', scope.stage.id);
                            });
                        }

                    }
                );

                // scope.$on('events.featured.changed', function () {
                //     API.stop();
                // });
            }
        }
    }
]);
