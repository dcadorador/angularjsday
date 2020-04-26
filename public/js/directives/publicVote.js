daystageApp.directive('publicVote', [
    'Stage',
    'Winner',
    'User',
    '$timeout',
    '$sce',
    '$state',
    '$stateParams',
    '$rootScope',
    function(Stage, Winner, User, $timeout, $sce, $state, $stateParams, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_publicVote.html',
            link: function(scope, element, attributes) {

                var ui;

                scope.stageInfo = {};

                scope.$on('events.stage.video.viewed', function(event, stageId) {
                    if (parseInt(stageId) == scope.stageInfo.stage.id) {
                        scope.stageInfo.stage.viewsCount++;
                    }
                });

                scope.updateVideoTime = function(current, duration) {
                    // console.log('scope.stageInfo.stage', scope.stageInfo.stage.id);
                    $rootScope.viewVideo(current, scope.stageInfo.stage.id);
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

                scope.loadStage = function(stageId) {
                    Stage.getPublicStageDetails(stageId).then(function(response) {
                        if (response.data.status) {
                            scope.stageInfo = {
                                user: User.model(
                                    response.data.data.user.id,
                                    response.data.data.user.email,
                                    response.data.data.user.firstName,
                                    response.data.data.user.lastName,
                                    response.data.data.user.birthDate,
                                    response.data.data.user.address,
                                    response.data.data.user.city,
                                    response.data.data.user.country,
                                    response.data.data.user.applauseCount,
                                    response.data.data.user.videoCount,
                                    response.data.data.user.followersCount,
                                    response.data.data.user.followingsCount,
                                    response.data.data.user.profilePicture,
                                    response.data.data.user.followed
                                ),
                                stage: Stage.model(
                                    response.data.data.stage.id,
                                    response.data.data.stage.description,
                                    response.data.data.stage.category,
                                    response.data.data.stage.tags,
                                    response.data.data.stage.video,
                                    response.data.data.stage.applauseCount,
                                    response.data.data.stage.commentCount,
                                    response.data.data.stage.viewsCount,
                                    response.data.data.stage.dateTime,
                                    response.data.data.stage.comments,
                                    response.data.data.stage.isApplauded
                                )
                            };
                        } else {}
                    });
                };

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
                });

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

                function setMainSectionHeight() {
                    // var mainSection = getElementByClassName('home-main-section')[0];
                    // $('.signup-container.pull-right')[0].height(mainSection.height());
                }

                function init() {
                    setMainSectionHeight();
                    if ($stateParams && $stateParams.sid && $stateParams.sid > 0) {
                        scope.loadStage($stateParams.sid);
                    }
                }

                init();
            }
        };
    }
]);
