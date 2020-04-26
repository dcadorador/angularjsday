daystageApp.directive('vgTopVideoHook', [

    function () {
        return {
            restrict: 'E',
            require: '^videogular',
            link: function (scope, element, attributes, API) {
                scope.$on('events.featured.changed', function () {
                    API.stop();
                });
            }
        }
    }
]);
