daystageApp.directive('feed', [
    'UserFeed',
    'User',
    'Stage',
    'DialogHelper',
    '$state',
    '$stateParams',
    function (UserFeed, User, Stage, DialogHelper, $state, $stateParams) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_feed.html',
            link: function (scope, element, attributes) {

                scope.filterMode = $stateParams.activeFilter;
                scope.userId = $stateParams.userId;
                scope.sort = '';
                scope.posts = [];
                scope.users = [];

                scope.isLoading = true;

                scope.$on('EVENT_USER_PROFILE_UPDATED', function () {
                    scope.getUserFeed();
                });

                scope.showPostsJumbo = function () {
                    return scope.isLoading == false && scope.posts.length == 0 && (scope.filterMode == '' || scope.filterMode == 'user');
                };

                scope.showFollowersJumbo = function () {
                    return scope.isLoading == false && scope.users.length == 0 && scope.filterMode == 'follower';
                };

                scope.showFollowingJumbo = function () {
                    return scope.isLoading == false && scope.users.length == 0 && scope.filterMode == 'following';
                };

                scope.profileViewed = function () {
                    return $stateParams.userId;
                };

                scope.showUsersJumbo = function () {
                    return scope.isLoading == false && scope.users.length == 0 && (scope.filterMode == 'follower' || scope.filterMode == 'following');
                };

                scope.uploadStageClick = function(){
                    $state.go('user-profile', { userId: 'home' , activeFilter: 'upload' });
                };

                scope.getUserFeed = function () {
                    scope.posts = [];
                    scope.users = [];
                    // hotfix
                    if ($stateParams.from == 'upload-stage' ||
                    $stateParams.from == 'user-profile') {
                        return;
                    }
                    scope.filterFeed();
                };

                scope.filterFeed = function () {
                    scope.posts = [];
                    scope.users = [];
                    if (scope.filterMode == '' && $state.is('user-profile')) {
                        scope.filterMode = 'user';
                    }
                    var userId = $stateParams.userId == 'home' || $stateParams.userId == 'upload' ? User.getUserId() : $stateParams.userId;
                    UserFeed.filterUserFeed(scope.filterMode, scope.sort, userId).then(function (response) {
                        scope.isLoading = false;
                        if (scope.filterMode == 'follower' || scope.filterMode == 'following') {
                            scope.users = response;
                        } else {
                            scope.posts = response;
                        }
                    },function(err){
                      scope.isLoading = false;
                    });
                };

                scope.$on('events.user.profile.filterFeed', function (event, args) {
                    scope.isLoading = true;
                    scope.filterMode = args;
                    scope.filterFeed();
                });

                scope.sortBy = function (sort) {
                    scope.isLoading = true;
                    scope.sort = sort;
                    scope.filterFeed();
                };

                scope.getUserFeed();

                scope.$on('events.stage.upload.ended', function () {
                    scope.getUserFeed();
                });

                scope.$on('events.window.scrollToBottom', function () {
                    console.log('events.window.scrollToBottom');
                    if (scope.isLoading)
                        return false;

                    if (!UserFeed.hasMorePages || UserFeed.filter == 'follower' || UserFeed.filter == 'following') {
                        return;
                    }

                    scope.isLoading = true;
                    UserFeed.nextPage().then(function (response) {
                        scope.posts = response;
                        scope.isLoading = false;
                    });
                });

            }
        };
    }
]);
