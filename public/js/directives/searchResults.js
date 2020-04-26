daystageApp.directive('searchResults', [
    'SearchService',
    '$timeout',
    'DialogHelper',
    'User',
    'Stage',
    '$state',
    function (SearchService, $timeout, DialogHelper, User, Stage, $state) {
        return {
            restrict: 'E',
            templateUrl: '../views/partials/_searchResults.html',
            link: function (scope, element, attributes) {

                scope.users = [];
                scope.posts = [];
                scope.is_loading = false;

                scope.$on('events.search.success', function (event, action) {
                    scope.is_loading = false;
                    if ($state.is('search')) {
                        scope.populate(action);
                    }
                });

                scope.$on('events.search.fail', function (event, action) {
                    scope.is_loading = false;
                    if ($state.is('search')) {
                        scope.users = [];
                        scope.posts = [];
                        scope.is_loading = false;
                    }
                });

                scope.$on('events.search.loading', function (event, action) {
                    if ($state.is('search')) {
                        scope.is_loading = true;
                    }
                });

                scope.$on('events.window.scrollToBottom', function (event) {
                    if ($state.is('search') && !scope.is_loading && SearchService.page.hasMorePages) {
                        SearchService.nextPage();
                    }
                });

                scope.populate = function (action) {
                    if (typeof SearchService.response.data == 'undefined') {
                        return;
                    }
                    if (action == 'search') {
                        scope.users = [];
                        scope.posts = [];
                    }
                    angular.forEach(SearchService.response.data.data.items, function (result, index) {
                        console.log(result);
                        if (SearchService.type == 'people') {
                            scope.users.push(User.model(
                                result.id,
                                result.email,
                                result.firstName,
                                result.lastName,
                                result.birthDate,
                                result.address,
                                result.city,
                                result.country,
                                result.applauseCount,
                                result.videoCount,
                                result.followersCount,
                                result.followingsCount,
                                result.profilePicture
                            ));
                        } else {
                            scope.posts.push({
                                user: User.model(
                                    result.user.id,
                                    result.user.email,
                                    result.user.firstName,
                                    result.user.lastName,
                                    result.user.birthDate,
                                    result.user.address,
                                    result.user.city,
                                    result.user.country,
                                    result.user.applauseCount,
                                    result.user.videoCount,
                                    result.user.followersCount,
                                    result.user.followingsCount,
                                    result.user.profilePicture,
                                    result.user.followed
                                ),
                                stage: Stage.model(
                                    result.stage.id,
                                    result.stage.description,
                                    result.stage.category,
                                    result.stage.tags,
                                    result.stage.video,
                                    result.stage.applauseCount,
                                    result.stage.commentCount,
                                    result.stage.viewsCount,
                                    result.stage.dateTime,
                                    result.stage.comments,
                                    result.stage.isApplauded
                                )
                            });
                        }
                    });
                };

                $timeout(function () {
                    try {
                        if (SearchService.response.data.status)
                            scope.populate(SearchService.response);
                    } catch (e) {

                    }
                });

            }
        }
    }
]);
