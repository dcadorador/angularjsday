daystageApp.directive('post', [
    'User',
    'Stage',
    'DialogHelper',
    'FeaturedVideo',
    '$timeout',
    '$sce',
    '$state',
    '$rootScope',
    function(User, Stage, DialogHelper, FeaturedVideo, $timeout, $sce, $state, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                post: '='
            },
            templateUrl: './views/partials/_post.html',
            link: function(scope, element, attributes) {

                scope.own = User.getUserId() == scope.post.user.id;
                scope.tempDescription = scope.post.stage.description;
                scope.applauseToggling = false;
                scope.edit = false;

                scope.updateVideoTime = function(current, duration) {
                    // console.log('scope.post.stage',scope.post.stage.id);
                    $rootScope.viewVideo(current, scope.post.stage.id);
                };

                scope.setEdit = function(bool){
                    scope.edit = bool;
                };

                scope.$on('events.stage.applaused', function(event, stageId) {
                    if (parseInt(stageId) == scope.post.stage.id) {
                        scope.post.stage.applauseCount++;
                        scope.post.stage.isApplauded = true;
                    }
                });

                scope.$on('events.stage.unapplaused', function(event, stageId) {
                    if (parseInt(stageId) == scope.post.stage.id) {
                        scope.post.stage.applauseCount--;
                        scope.post.stage.isApplauded = false;
                    }
                });

                scope.$on('events.stage.video.viewed', function(event, stageId) {
                    if (parseInt(stageId) == scope.post.stage.id) {
                        scope.post.stage.viewsCount++;
                    }
                });

                scope.$on('events.stage.add.comment', function(event, stageId) {
                    if (parseInt(stageId) == scope.post.stage.id) {
                        scope.post.stage.commentCount++;
                    }
                });

                scope.$on('events.stage.remove.comment', function(event, stageId) {
                    if (parseInt(stageId) == scope.post.stage.id) {

                        if (scope.post.stage.commentCount > 0)
                            scope.post.stage.commentCount--;

                        if (scope.post.stage.commentCount === 0)
                            scope.post.comments = [];
                    }
                });

                $timeout(function() {
                    if (scope.post.stage.isYouTube) {
                        scope.post.sources = [{
                            src: scope.post.stage.youTubeUrl
                        }];
                    } else {
                        scope.post.sources = [{
                            src: $sce.trustAsResourceUrl(scope.post.stage.video),
                            type: 'video/mp4'
                        }];
                    }
                });

                scope.commentContainerVisible = false;

                scope.hideCommentBox = function() {
                    scope.commentContainerVisible = false;
                };

                scope.showCommentBox = function() {
                    scope.post.comments = [];
                    scope.loadComments(function() {
                        scope.commentContainerVisible = true;
                    });
                };

                scope.postComment = function() {
                    User.comment(parseInt(scope.post.stage.id), scope.comment.text).then(function(response) {
                        scope.comment.text = '';
                        scope.loadComments();
                    });
                };

                scope.loadComments = function(cb) {
                    User.getComments(scope.post.stage.id).then(function(response) {
                        if (response.data.status) {
                            scope.post.comments = response.data.data;
                            angular.forEach(scope.post.comments, function(value, key) {
                                scope.post.comments[key].date.date = Date.parse(scope.post.comments[key].date.date);
                            });
                            if (cb && typeof cb === "function") cb();
                        }
                    });
                };

                scope.applause = function() {
                    scope.applauseToggling = true;
                    User.applause(scope.post.stage.id).then(function(response) {
                        scope.applauseToggling = false;
                    });
                };

                scope.removeApplause = function() {
                    scope.applauseToggling = true;
                    User.removeApplause(scope.post.stage.id).then(function(response) {
                        scope.applauseToggling = false;
                    });
                };

                scope.updateDescription = function() {
                    Stage.updateDescription(scope.post.stage.id, scope.tempDescription).then(function(response) {
                        scope.post.stage.description = scope.tempDescription;
                        scope.edit = false;
                    });
                };

                scope.deleteStage = function() {
                    DialogHelper.confirm('Confirm your action', 'Are you sure you want to delete this video?').then(function() {
                        Stage.deleteStage(scope.post.stage.id).then(function(response) {
                            var e = $(element).find('.post');
                            $(e).fadeOut('slow', function() {
                                $(element).remove();
                                DialogHelper.showBasic(scope, undefined, 'Success', 'Video is successfully deleted.', undefined, undefined, {
                                    width: 30
                                });
                            });
                        });
                    }, function() {});
                };

                scope.isEditMode = function() {
                    return scope.edit === true;
                }

                scope.report = function() {
                    DialogHelper.confirm('Confirm your action', 'Are you sure you want to report this video?').then(function() {
                        Stage.reportStage(scope.post.stage.id).then(function(response) {
                            DialogHelper.showBasic(scope, undefined, 'Success', 'Thanks! Video is successfully reported.', undefined, undefined, {
                                width: 30
                            });
                        });
                    }, function() {});
                };

                /**
                 * This function is for the mobile posts
                 * so it will show the video at the winner video
                 * area when clicked.
                 */
                scope.showVideo = function() {
                    if (($state.is('user-profile') || $state.is('search')) && !scope.$parent.$parent.isDesktopMode) {
                        DialogHelper.showAdvanced(scope, [
                            '$scope',
                            'DialogHelper',
                            function($scope, DialogHelper) {
                                $scope.cancel = function() {
                                    DialogHelper.close();
                                };
                                $scope.post = scope.post;
                            }
                        ], '../views/partials/_videoDialog.html');
                    } else {
                        FeaturedVideo.setFeaturedVideo(scope.post, false);
                        $timeout(function() {
                            $('html, body').animate({
                                scrollTop: 0
                            }, 'slow');
                        }, 300);
                    }
                };

            }
        };
    }
]);
