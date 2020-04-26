daystageApp.directive('winnerInfo', [
    'User',
    'DialogHelper',
    'FeaturedVideo',
    '$state',
    function (User, DialogHelper, FeaturedVideo,$state) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_winnerInfo.html',
            scope: { info: '=', header:'@' },
            link: function (scope, element, attributes) {
                scope.isLoggedIn = User.isLoggedIn();
                scope.isWinner = false;

                scope.setHeader = function(){
                  if(scope.header)
                    return scope.header;

                  if(scope.isWinner || $state.includes('vote-video')){
                    return 'Today\'s Winner';
                  }
                  else{
                    return 'Today\'s Top 10';
                  }
                };

                scope.$watch('info', function () {
                    scope.isWinner = FeaturedVideo.isWinner;
                    scope.shareType = scope.isWinner ? 'winner' : 'top';
                });

            }
        };
    }
]);
