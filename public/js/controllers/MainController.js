daystageApp.controller('MainController', [
    '$scope',
    '$state',
    '$rootScope',
    '$mdSidenav',
    '$timeout',
    'User',
    'SearchService',
    'FeaturedVideo',
    'LocalStorage',
    'DialogHelper',
    function($scope, $state, $rootScope, $mdSidenav, $timeout, User, SearchService, FeaturedVideo, LocalStorage, DialogHelper) {
        moment.tz.add([
            'America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0',
            'America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0'
        ]);
        moment.tz.setDefault("America/New_York");

        $scope.uploadBottomSheetVisibility = false;
        $scope.isSidenavOpen = false;
        $scope.mobileMenuOpen = false;
        $scope.searchMode = false;
        $scope.isDesktopMode = $rootScope.isDesktopMode = !isMobile;
        $scope.isFacebookVisible = true;

        $scope.$on('EVENT_FACEBOOK_UNVERIFIED', function(sender, data) {
            $scope.isFacebookVisible = false;
        });

        $scope.isLoading = true;
        $scope.isLoggedIn = User.isLoggedIn();

        $(window).resize(function() {
            $scope.$apply(function() {
                $scope.isDesktopMode = !window.mobilecheck();
            });
        });

        function getTooltipLocalStorageValue() {

        }

        function setTooltipStorage(key) {
            return LocalStorage.set(key, true);
        }

        function isShowTooltip(key) {
            if (!$scope.isLoggedIn) return false;

            if (!LocalStorage.isSupported()) return false;

            if (LocalStorage.get(key)) return false;

            return true;
        }

        // $scope.$watch('isLoggedIn',function(n,o){
        //     if(n){
        //
        //     }
        // });
        //

        $rootScope.closeTooltip = function(type) {
            switch (type) {
                case "youtube":
                    $scope.userTooltips.youtube.close();
                    break;
                case "upload":
                    $scope.userTooltips.upload.close();
                    break;
            }
        };

        $scope.userTooltips = {
            init: function() {
                $scope.userTooltips.youtube.show = $scope.userTooltips.youtube.isEnabled = isShowTooltip('youtube');
                // $scope.userTooltips.applause.show = isShowTooltip('applause');
                $scope.userTooltips.applause.show = $scope.userTooltips.applause.isEnabled = false; // isShowTooltip('applause');
                // $scope.userTooltips.upload.show = isShowTooltip('upload');
                $scope.userTooltips.upload.show = $scope.userTooltips.upload.isEnabled = isShowTooltip('upload');
            },
            "youtube": {
                show: (function() {
                    return isShowTooltip('youtube');
                })(),
                // text: 'Upload your first video to begin getting exposure!',
                html: 'youtubePopoverTemplate.html',
                isAnimation: true,
                trigger: 'none',
                isEnabled: false,
                placement: 'bottom',
                close: function() {
                    // create local storage file
                    if (setTooltipStorage('youtube'))
                        $scope.userTooltips.youtube.show = false;
                }
            },
            "upload": {
                show: (function() {
                    return isShowTooltip('upload');
                })(),
                // text: 'Upload your first video to begin getting exposure!',
                html: 'uploadPopoverTemplate.html',
                isAnimation: true,
                trigger: 'none',
                placement: 'bottom',
                isEnabled: false,
                close: function() {
                    // create local storage file
                    if (setTooltipStorage('upload'))
                        $scope.userTooltips.upload.show = false;
                }
            },
            "applause": {
                show: (function() {
                    return isShowTooltip('applause');
                })(),
                // text: 'Applaud Stages that you like & help them be featured on the main page!',
                html: 'applausePopoverTemplate.html',
                isAnimation: true,
                isEnabled: false,
                trigger: 'none',
                placement: 'bottom',
                close: function() {
                    // create local storage file
                    // setTooltipStorage('applause');
                    if (setTooltipStorage('applause'))
                        $scope.userTooltips.applause.show = false;
                }
            }
        };

        function setHeaderHeight() {
            // var height = $(".app-header").height();
            // // var view = $("div[ui-view]");
            // $("div[ui-view]") && $("div[ui-view]").css("top", height + "px");
        }

        // $timeout(function() {
        // setHeaderHeight();
        // }, 600)

        $scope.isShowTopTen = function() {
            if ($scope.mobileMenuOpen) return false;
            if (!$scope.isLoggedIn) return false;
            // if (!$scope.isDesktopMode && !$scope.isLoggedIn) return false;

            return true;
        };

        $scope.viewsObject = {};
        $rootScope.viewStageInSeconds = 3;
        $rootScope.viewVideo = function(currentTime, stageVideo) {
            // if (User.isLoggedIn()) {

            // If user has watched over 3 seconds
            if (currentTime >= $rootScope.viewStageInSeconds) {
                if (!$scope.viewsObject[stageVideo]) {
                    User.viewStage(stageVideo);
                    $scope.viewsObject[stageVideo] = true;
                    $rootScope.$broadcast('events.stage.video.viewed', stageVideo);
                }
            }
            // console.log('viewsObject', $scope.viewsObject);
            // }
        };

        $rootScope.generateTomorrowsDate = function() {
            var endHourNYTime = 7;
            // var tomorrowDate = moment.tz(moment().format("YYYY-MM-DD HH:mm").set('hours'), "America/New_York");
            var now = moment.tz(moment().format("YYYY-MM-DD HH:mm"), "America/New_York");
            var endDate = moment().set('hour', endHourNYTime).set('minute', 0).set('second', 0).format();
            // var tomorrowDate = moment().set('hour', 15).set('minute', 0).format("YYYY-MM-DD HH:mm");
            if (now.hour() >= endHourNYTime)
                endDate = moment().add(1, 'day').set('hour', endHourNYTime).set('minute', 0).set('second', 0).format();


            // .format('YYYY-MM-DD HH:mm');
            // var zone = "America/New_York";

            return endDate;
        };
        $scope.winnerAnnouncementEndTime = $rootScope.generateTomorrowsDate();

        $scope.toggleSideNav = function() {
            $mdSidenav('left').toggle();
        };

        $rootScope.uploadButtonClick = function() {

            var state = 'user-profile',
                notify = {
                    reload: true
                },
                params = {
                    userId: 'home',
                    activeFilter: 'user'
                };

            // console.log("$state.current", $state.current);
            if ($state.current.name == 'user-profile') {
                state = '.';

            }

            $state.go(state, params, notify).then(function() {
                if ($rootScope.userProfileFilter) {
                    $rootScope.userProfileFilter('user');
                }
                $timeout(function() {
                    $rootScope.$broadcast('events.user.profile.filterFeed', 'user');
                });
            });
        };

        $scope.uploadButtonClick = $rootScope.uploadButtonClick;

        $scope.logoClick = function() {

            if ($state.is('home-logged-in')) {
                //if ($state.is('home-logged-in') || $state.is('home')) {
                // $state.go('home-logged-in', {
                //     reload: true
                // });

                FeaturedVideo.setFeaturedVideoToWinner();
                $('.top-thumbnail').removeClass('selected');
            } else {
                $state.go('home', {
                    reload: true
                });
            }
        };

        $scope.toggleUploadBottomSheet = function() {
            $scope.uploadBottomSheetVisibility = false;
        };

        $scope.toggleMobileMenu = function() {
            $scope.mobileMenuOpen = !$scope.mobileMenuOpen;
        };

        window.onscroll = function(ev) {
            //console.log('window.onscroll ');
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight - 1) {
                $scope.$broadcast('events.window.scrollToBottom');
            }
        };

        $("div[ui-view]").resize(function() {
            setHeaderHeight();
        });

        $scope.$on('EVENT_USER_LOGGED_IN', function() {
            User.userInfo().then(function(response) {
                $scope.isLoading = false;
                if ($state.is('vote-video')) {
                    window.location.reload();
                } else {
                    window.location = window.location.href;
                    //$scope.isLoggedIn = true;
                }
                setHeaderHeight();
                $scope.userTooltips.init();
            });
        });

        $scope.$on('EVENT_USER_LOGGED_OUT', function() {
            $scope.mobileMenuOpen = false;
            $scope.isLoggedIn = false;
            $scope.isLoading = false;
            if ($state.is('vote-video')) {
                window.location.reload();
            } else {
                $state.go('home');
                window.location.reload();
            }
            setHeaderHeight();
            $scope.userTooltips.init();
        });

        $scope.$on('events.search.success', function(sender, args) {
            $state.go('search', {
                q: SearchService.q,
                type: SearchService.type,
            });
        });

        $scope.$on('events.search.fail', function(sender, args) {
            $state.go('search', {
                q: SearchService.q,
                type: SearchService.type,
            });
        });

        $scope.$on('events.stage.upload.started', function() {
            $scope.uploadBottomSheetVisibility = true;
        });

        $scope.$on('events.stage.upload.ended', function() {
            $timeout(function() {
                $scope.uploadBottomSheetVisibility = false;
            });
        });
        $scope.userTooltips.init();
    }
]);
