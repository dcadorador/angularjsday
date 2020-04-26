daystageApp.directive('topTen', [
    'FeaturedVideo',
    'TopTen',
    'User',
    '$timeout',
    '$compile',
    '$state',
    '$stateParams',
    '$rootScope',
    function(FeaturedVideo, TopTen, User, $timeout, $compile, $state, $stateParams, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_topTen.html',
            link: function(scope, element, attributes) {
                scope.isDesktopMode = $rootScope.isDesktopMode;
                var slick = undefined;

                var fixCarousel = function() {
                    if (!scope.isDesktopMode) {
                        slick = $('.toptenslider');
                    } else {
                        slick = $('.slick-carousel')
                        // .slick({
                        //     dots: true,
                        //     infinite: true,
                        //     speed: 500,
                        //     fade: true,
                        //     cssEase: 'linear'
                        // });
                        .slick({
                            dots: false,
                            infinite: false,
                            arrows:true,
                            speed: 300,
                            slidesToShow: 4,
                            slidesToScroll: 4,
                            focusOnSelect: false,
                            responsive: [{
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    infinite: true,
                                    dots: true
                                }
                            }, {
                                breakpoint: 600,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                }
                            }, {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }]
                        });
                    }
                };

                scope.stages = [];

                TopTen.all().then(function(response) {
                    scope.defaultStage = null;
                    if (response.isSuccess) {
                        scope.stages = response.data;
                    }
                    angular.forEach(scope.stages, function(stage, index) {
                        var single_stage = $compile("<div class=\"item\" ng-click=\"selectStage(stages[" + index + "])\" >\
                                                        <div class=\"top-thumbnail\" ng-class=\"{'selected': selected==stages[" + index + "].stage.id}\">\
                                                            <img ng-src=\"{{ stages[" + index + "].stage.isYouTube ? '//img.youtube.com/vi/' + stages[" + index + "].stage.youTubeId + '/mqdefault.jpg' : stages[" + index + "].stage.thumbnail }}\"\
                                                                 alt=\"\">\
                                                            <div class=\"applause-ribbon\">\
                                                                <div class=\"applause-icon\"></div>\
                                                                <p class=\"applause-score\">{{stages[" + index + "].stage.applauseCount}}</p>\
                                                            </div>\
                                                        </div>\
                                                        <div class=\"item-details\" ng-class=\"{'selected': selected==stages[" + index + "].stage.id}\" >\
                                                          <p class=\"description\">{{ stages[" + index + "].stage.description|textOverflow:20 }}</p>\
                                                          <p class=\"user-name\">{{ stages[" + index + "].user.firstName + ' ' + stages[" + index + "].user.lastName }}</p>\
                                                          <div ng-if=\"selected==stages[" + index + "].stage.id\" class=\"back-btn-v2\">\
                                                            <span class=\"glyphicon glyphicon-resize-small\"></span>\
                                                          </div>\
                                                        </div>\
                                                    </div>")
                            (scope);
                        if (!scope.isDesktopMode) {
                            slick.append(single_stage);
                        } else {
                            slick.slick('slickAdd', single_stage);
                        }

                        if ($stateParams.sid == stage.stage.id) {
                            scope.defaultStage = stage;
                        }

                    });

                    if ($stateParams.sid !== null && typeof($stateParams.sid) != 'undefined') {
                        scope.selectStage(scope.defaultStage);
                    }

                }, function(response) {});

                scope.selectStage = function(stage) {
                    if (scope.selected == stage.stage.id) {
                        FeaturedVideo.setFeaturedVideoToWinner().then(function(response) {
                            scope.selected = FeaturedVideo.stage.stage.id;
                        });
                    } else {
                        FeaturedVideo.setFeaturedVideo(stage, false);
                        scope.selected = stage.stage.id;
                        // scroll top
                        if(document.body.scrollTop > 50)
                          $("html, body").animate({ scrollTop: 0 }, "slow");

                    }
                };

                $timeout(fixCarousel);
            }
        };
    }
]);
