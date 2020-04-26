daystageApp.directive('winner', [
    'FeaturedVideo',
    'Winner',
    'Stage',
    'User',
    '$timeout',
    '$sce',
    '$rootScope',
    'DialogHelper',
    function(FeaturedVideo, Winner, Stage, User, $timeout, $sce, $rootScope, DialogHelper) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_winner.html',
            link: function(scope, element, attributes) {

                var ui;

                scope.winner = {};

                scope.isWinner = true;
                scope.shareType = scope.isWinner ? 'winner' : 'top';

                scope.updateVideoTime = function(current, duration) {
                    // console.log('scope.stageInfo.stage',scope.stageInfo.stage.id);
                    $rootScope.viewVideo(current, scope.stageInfo.stage.id);
                };
                scope.updateVideoState = function(state) {
                    // console.log(state);
                };

                scope.$on('events.stage.applaused', function(event, stageId) {
                    if (parseInt(stageId) == scope.stageInfo.stage.id) {
                        scope.stageInfo.stage.applauseCount++;
                        scope.stageInfo.stage.isApplauded = true;
                    }
                });

                scope.$on('events.stage.unapplaused', function(event, stageId) {
                    if (parseInt(stageId) == scope.stageInfo.stage.id) {
                        scope.stageInfo.stage.applauseCount--;
                        scope.stageInfo.stage.isApplauded = false;
                    }
                });

                scope.$on('events.stage.video.viewed', function(event, stageId) {
                    if (parseInt(stageId) == scope.stageInfo.stage.id) {
                        scope.stageInfo.stage.viewsCount++;
                    }
                });

                scope.$on('events.featured.changed', function() {
                    scope.stageInfo = FeaturedVideo.stage;
                    scope.isWinner = FeaturedVideo.isWinner;
                    scope.shareType = scope.isWinner ? 'winner' : 'top';
                    if (scope.stageInfo.stage.isYouTube) {
                        scope.stageInfo.sources = [{
                            src: scope.stageInfo.stage.youTubeUrl
                        }];
                    } else {
                        scope.stageInfo.sources = [{
                            src: $sce.trustAsResourceUrl(scope.stageInfo.stage.video),
                            type: 'video/mp4'
                        }];
                    }
                });

                scope.loadWinner = function() {
                    FeaturedVideo.setFeaturedVideoToWinner().then(function(response) {
                        scope.winner = FeaturedVideo.stage;
                    });
                };

                scope.loadWinner();

                var hideUi = function() {
                    ui.fadeOut("slow", function() {
                        ui.hide();
                    });
                };

                var showUi = function() {
                    ui.fadeIn("slow", function() {
                        ui.show();
                    });
                };

                $timeout(function() {
                    ui = $('winner-info,.footer-controls,.overlay,.signup-container');
                }, 100);

                scope.$on('events.videoOverlay.state.change', function(event, args) {

                    if (typeof ui == 'undefined')
                        ui = $('winner-info,.footer-controls,.overlay,.signup-container');

                    if (typeof ui == 'undefined')
                        return;

                    if (args.state == 'play') {
                        hideUi();
                    } else {
                        showUi();
                    }
                });

                scope.featureMyVideoSurvey = function() {
                    function answerSurvey(answer) {
                        User.answerSurvey(answer)
                            .then(function(response) {
                                if (response.data.status) {
                                    // setLocalStorageUserSurvey();
                                    // console.log('success');
                                } else {
                                    // console.log('fail');
                                }
                            });
                    }

                    DialogHelper.showAdvanced(scope, [
                        '$scope',
                        '$mdDialog',
                        function($scope, $mdDialog) {

                            $scope.cancel = function() {
                                $mdDialog.cancel();
                            };

                            $scope.no = function() {
                                // send no to server
                                answerSurvey('no');
                                $scope.cancel();
                            };

                            $scope.yes = function() {
                                // send yes to server
                                answerSurvey('yes');
                                $scope.cancel();
                            };

                        }
                    ], './views/partials/_willYouPay.html')
                }

            }
        };
    }
]);
