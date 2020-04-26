daystageApp.factory('UploadStageService', [
    'Global',
    'Upload',
    '$window',
    '$rootScope',
    function (Global, Upload, $window, $rootScope) {
        return {

            progress: 0,

            isUploading: false,

            fileName: '',

            _upload: null,

            cancel: function () {
                if (this._upload) {
                    this._upload.abort();
                    $rootScope.$broadcast('events.stage.upload.aborted');
                }
            },

            upload: function (name, description, category, tags, videoFile) {

                var _this = this;
                this.isUploading = true;
                this.fileName = videoFile.name;

                $rootScope.$broadcast('events.stage.upload.started');

                this._upload = Upload.upload({
                    url: Global.domain + '/stages/add',
                    data: {
                        userId: $window.localStorage.userId,
                        name: name,
                        description: description,
                        category: category,
                        tags: tags,
                        videoFile: videoFile
                    }
                });

                return this._upload.then(

                    // upload finished
                    function (response) {
                        $rootScope.$broadcast('events.stage.upload.ended');
                        _this.isUploading = false;
                        return response;
                    },

                    // error occured
                    function (response) {
                        $rootScope.$broadcast('events.stage.upload.error', response);
                        _this.isUploading = false;
                        return response;
                    },

                    // upload progress
                    function (event) {
                        $rootScope.$broadcast('events.stage.upload.progress', event);
                        _this.progress = Math.min(100, parseInt(100.0 * event.loaded / event.total));
                    }

                );
            },

        };
    }
]);
