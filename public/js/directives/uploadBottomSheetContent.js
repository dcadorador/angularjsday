daystageApp.directive("uploadBottomSheetContent", [
    'UploadStageService',
    'DialogHelper',
    '$state',
    function (UploadStageService, DialogHelper, $state) {
        return {
            restrict: 'E',
            scope: {
                info: "="
            },
            templateUrl: "./views/partials/_uploadBottomSheetContent.html",
            link: function (scope, element, attributes, User) {

                scope.$on('events.stage.upload.started', function () {
                    scope.filename = UploadStageService.fileName;
                    scope.progress = 0;
                });

                scope.$on('events.stage.upload.aborted', function () {
                    scope.filename = '';
                    scope.progress = 0;
                    scope.closeBottomSheet();
                });

                scope.$on('events.stage.upload.ended', function () {
                    scope.filename = '';
                    scope.progress = 0;
                    if (!$state.is('upload-stage')) {
                        scope.closeBottomSheet();
                        $state.go('user-profile', { 'userId': 'home' });
                    }
                });

                scope.$on('events.stage.upload.progress', function () {
                    scope.progress = UploadStageService.progress;
                });

                scope.closeBottomSheet = function () {
                    scope.$parent.uploadBottomSheetVisibility = false;
                };

                scope.cancelUpload = function () {
                    DialogHelper.confirm('Warning', 'Are you sure you want to cancel uploading?').then(function (yes) {
                        if (yes)
                            UploadStageService.cancel();
                    });
                }

            }
        };
    }
]);
