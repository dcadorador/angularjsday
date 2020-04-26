daystageApp.directive('youTubeVideos', [
    'YouTube',
    'Category',
    'User',
    'DialogHelper',
    '$timeout',
    function(YouTube, Category, User, DialogHelper, $timeout) {
        return {
            restrict: 'E',
            templateUrl: '../views/partials/_youTubeVideos.html',
            scope: {
                method: '@'
            },
            link: function(scope, element, attributes) {

                scope.videos = [];
                scope.googleAuthButtonVisible = false;
                scope.progressCircularVisible = false;
                scope.categories = [];
                scope.isFacebookShare = false;
                scope.isFirstClick = false;
                Category.getCategories().then(function(response) {
                    scope.categories = response.data.data;
                });

                scope.authenticate = function() {
                    YouTube.authenticate();
                };

                scope.addYouTubeVideos = function() {
                    scope.isFirstClick = true;
                    var videosToSave = [];
                    var isError = false;

                    if(scope.videos.length == 0){
                        return;
                    }

                    for(var i=0; i<scope.videos.length; i++){
                        var v = scope.videos[i];
                        if (v.selected) {
                            v.categoryValidation = false;

                            if(v.category == ''){
                              v.categoryValidation = true;
                              isError = true;
                            }

                            
                            videosToSave.push(v);
                        }
                    }

                    if(isError == true) videosToSave = [];

                    if (videosToSave.length > 0) {
                            YouTube.addToCache(videosToSave);
                            DialogHelper.close();
                    } else {
                          // close;
                    }
                };

                scope.$on('events.youtube.waiting', function(event, args) {
                    scope.$apply(function() {
                        scope.progressCircularVisible = args;
                    });
                });

                scope.$on('events.youtube.auth.success', function() {
                    scope.$apply(function() {
                        scope.googleAuthButtonVisible = false;
                    });
                });

                scope.$on('events.youtube.data.loaded', function(event, args) {
                    scope.$apply(function() {
                        angular.forEach(args, function(video, index) {
                            scope.videos.push({
                                id: video.snippet.resourceId.videoId,
                                title: video.snippet.title,
                                description: video.snippet.description,
                                category: '',
                                tags: '',
                                thumbnail: video.snippet.thumbnails.default.url,
                                selected: false,
                                share: true
                            });
                        });
                    });
                });

                scope.$on('events.youtube.auth.fail', function() {
                    scope.$apply(function() {
                        scope.googleAuthButtonVisible = true;
                    });
                });

                $timeout(function() {
                    YouTube.initialize().then(function() {});
                });

            }
        };
    }
]);
