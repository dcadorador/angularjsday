daystageApp.directive('uploadStage', [
    '$rootScope',
    '$timeout',
    'Upload',
    'Tags',
    '$filter',
    'User',
    'Stage',
    'YouTube',
    'Category',
    'DialogHelper',
    'Facebook',
    'Global',
    'UploadStageService',
    '$state',
    '$stateParams',
    function($rootScope, $timeout, Upload, Tags, $filter, User, Stage, YouTube, Category,
        DialogHelper, Facebook, Global, UploadStageService, $state, $stateParams) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_upload-stage.html',
            link: function(scope, element, attributes) {
                $rootScope.closeTooltip('upload');
                scope.isLoading = false;
                scope.isShowError = false;
                scope.videoFile = '';
                scope.stage = {
                    videoFile: null,
                    share: false,
                    tags: [],
                    category: ''
                };

                scope.errorMessage = '';

                scope.valid = {
                    hashtags: true,
                    description: true,
                    category: true,
                    video: true
                };

                scope.categories = [];
                scope.fileName = '';
                scope.cantPreview = false;
                scope.youtubeVideos = [];
                scope.placeHolderVisible = true;
                scope.tagOptions = [];

                var share = function(response) {
                    var stage = response.data.data;
                    switch (typeof stage.length) {
                        case 'number':
                            Facebook.fbShare(stage[0].stage, stage[0].user, 'post');
                            break;
                        case 'undefined':
                            Facebook.fbShare(stage.stage, stage.user, 'post');
                            break;
                        default:
                            // console.log('No data to share');
                    }
                };

                Category.getCategories().then(function(response) {
                    scope.categories = response.data.data;
                });
                scope.$on('events.stage.upload.started', function() {
                    // console.log('***********');
                    scope.videoFile.progress = 1;
                });
                scope.$on('events.stage.upload.ended', function() {
                    scope.videoFile.progress = 0;
                    scope.closeBottomSheet();
                    scope.isLoading = true;
                    scope.removeVideo();
                    $timeout(function() {
                        scope.isLoading = false;
                        $rootScope.$broadcast('EVENT_USER_PROFILE_UPDATED');

                    }, 400);
                });
                scope.$on('events.stage.uploadYouTube.ended', function(e, videos) {
                    if (!scope.videoFile) {
                        if ($state.is('user-profile') && $stateParams.activeFilter == 'user') {
                            scope.closeBottomSheet();
                            $timeout(function() {
                                $rootScope.$broadcast('events.user.profile.filterFeed', 'user');
                            });
                        } else {
                            scope.closeBottomSheet();
                        }
                    }
                });
                scope.$on('events.stage.upload.progress', function() {
                    if (scope.videoFile.progress < UploadStageService.progress)
                        scope.videoFile.progress = UploadStageService.progress;
                });
                scope.$on('events.youtube.videosCached', function(e, videos) {
                    scope.youtubeVideos = videos;
                    var videosToUpload = [];
                    scope.videoFile.progress = 50;

                    for (var i = 0; i < scope.youtubeVideos.length; i++) {
                        var v = scope.youtubeVideos[i];
                        var categoryName = scope.getCategoryNameById(v.category);
                        v.tags += ' #' + categoryName;
                        v.tags = v.tags.replace(/(^,)|(,$)/g, "").replace(/#/g, ",").replace(/\s/g, "");
                        v.tags = v.tags.slice(1);
                        // delete
                        delete v.categoryValidation;
                        v.video = v.id;
                        delete v.id;
                        v.name = v.title;
                        delete v.title;

                        videosToUpload.push(v);
                    }

                    if (videosToUpload.length > 0) {

                        User.addYouTubeVideos(videosToUpload).then(function(response) {
                            if ($state.is('user-profile') && $stateParams.activeFilter == 'user') {
                                $timeout(function() {
                                    scope.closeBottomSheet();
                                    scope.removeVideo();
                                    scope.videoFile.progress = 0;
                                    $rootScope.$broadcast('events.user.profile.filterFeed', 'user');
                                });
                            } else {
                                scope.closeBottomSheet();
                            }
                        });
                    }

                });
                scope.$on('events.stage.upload.aborted', function() {
                    scope.videoFile.progress = 0;
                    scope.closeBottomSheet();
                });
                scope.queryTags = function(search) {
                    // Tags.getTags(search).then(function (response) {
                    //     scope.tagOptions = response.data.data;
                    // });
                    scope.tagOptions = [];
                };
                scope.fileSelect = function($files) {
                    if ($files.length <= 0)
                        return;
                    scope.fileName = $files[0].name;
                    scope.stage.videoFile = scope.videoFile;
                    if (typeof scope.videoFile != 'undefined') {
                        scope.cantPreview = (scope.videoFile.type == 'video/avi');
                    }
                };
                scope.removeVideo = function() {
                    scope.fileName = '';
                    scope.videoFile = '';
                    scope.youtubeVideos = [];
                    scope.stage = {
                        videoFile: null,
                        share: false,
                        tags: []
                    };
                };
                scope.youtubeSelect = function() {
                    var popup = 'Can\'t see your YouTube videos? Make sure you are connected to the right channel on youtube.com';
                    if (!$rootScope.isDesktopMode)
                        popup = 'Select YouTube Videos';
                    DialogHelper.showBasic(scope, undefined, popup, '<you-tube-videos method="cache"></you-tube-videos>', undefined, undefined, {
                        width: 4
                    });
                };

                scope.isUploadStageAllowed = function() {

                    if (typeof scope.UploadStageForm == 'undefined')
                        return false;



                    return scope.UploadStageForm.$valid &&
                        scope.stage.category != '' &&
                        scope.stage.tags.length > 0 &&
                        (scope.videoFile || scope.youtubeVideos.length > 0);
                };
                scope.closeBottomSheet = function() {
                    scope.$parent.uploadBottomSheetVisibility = false;
                };
                scope.getCategoryNameById = function(id) {
                    var i = 0,
                        name = '';
                    while (i < scope.categories.length && name == '') {
                        if (scope.categories[i].id == id)
                            name = scope.categories[i].name;
                        i++;
                    }
                    return name;
                };
                scope.uploadStage = function() {
                    console.log('#########################', scope.isShowError);

                    console.log('description', scope.stage.description, scope.stage.description == '');

                    if (!scope.videoFile && scope.youtubeVideos.length == 0) {
                        scope.errorMessage = 'Please add your stage (video)...';
                        return true;
                    }

                    if (scope.stage.category == '' || scope.stage.category == null || scope.stage.category == undefined) {
                        scope.errorMessage = 'Please select your stage a category...';
                        return true;
                    }

                    if (scope.stage.description == '' || scope.stage.description == null || scope.stage.description == undefined) {
                        scope.errorMessage = 'Please give your stage a description...';
                        return true;
                    }

                    if (scope.stage.tags.length == 0 || scope.stage.tags.indexOf("#") < 0) {
                        scope.valid.hashtags = false;
                        scope.errorMessage = 'Please add hashtags for better exposure...';
                        return true;
                    }



                    scope.errorMessage = '';

                    if (scope.isUploadStageAllowed()) {
                        //scope.isLoading = true;



                        scope.stage.tags += ' #' + scope.getCategoryNameById(scope.stage.category);

                        var tags = scope.stage.tags.replace(/(^,)|(,$)/g, "").replace(/#/g, ",").replace(/\s/g, "");
                        tags = tags.slice(1);

                        // angular.forEach(scope.stage.tags, function(tag, key) {
                        //     tags += (tag.tag || tag) + ',';
                        // });
                        // tags = tags.replace(/(^,)|(,$)/g, '');
                        //
                        var videosToUpload = [];

                        scope.videoFile.progress = 5;

                        UploadStageService.upload(scope.stage.name, scope.stage.description,
                            scope.stage.category, tags, scope.videoFile).then(function(response) {
                            if (scope.stage.share) share(response);
                        });

                    }
                };
            }
        };
    }
]);
