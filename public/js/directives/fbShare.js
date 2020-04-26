daystageApp.directive('fbShare', [
    'Facebook',
    'Stage',
    function(Facebook, Stage) {
        return {
            restrict: 'A',
            scope: {
                shareStage: '=',
                user: '=',
                shareType: '@'
            },
            link: function(scope, element, attributes) {
                element.on('click', function() {
                    console.log(Stage, scope.shareStage);
                    Stage.logShare(scope.shareStage.id);
                    Facebook.fbShare(scope.shareStage, scope.user, scope.shareType);
                });
            }
        };
    }
]);
