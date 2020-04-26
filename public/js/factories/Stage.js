daystageApp.factory('Stage', [
    'Global',
    'User',
    '$http',
    '$sce',
    function (Global, User, $http, $sce) {
        return {

            /**
             * Asynchronous.
             * Get the stage details.
             *
             * @param stageId
             * @returns {*}
             */
            getStageDetails: function (stageId) {
                return $http.get(Global.domain + '/stages/' + stageId);
            },

            getPublicStageDetails: function (stageId) {
                return $http.get(Global.domain + '/daystage/stage/' + stageId);
            },

            /**
             * Make a stage object.
             * This is just to have a standards for stages.
             *
             * @param id
             * @param description
             * @param category
             * @param tags
             * @param video
             * @param applauseCount
             * @param viewsCount
             * @param dateTime
             * @param comments
             * @param isApplauded
             * @returns {*}
             */
            model: function (id, description, category, tags,
                             video, applauseCount, commentCount, viewsCount,
                             dateTime, comments, isApplauded) {

                var _this = this;

                var isYouTube = (video.indexOf('http') === -1);
                var sources = null;

                if (isYouTube) {
                    sources = [{src: 'https://www.youtube.com/watch?v=' + video}];
                } else {
                    sources = [{
                        src: $sce.trustAsResourceUrl(video), type: 'video/mp4'
                    }];
                }

                return {
                    id: id,
                    description: description,
                    category: category,
                    tags: (typeof tags == 'string' ? tags.split(',') : tags),
                    video: isYouTube ? '' : video,
                    applauseCount: applauseCount || 0,
                    viewsCount: viewsCount || 0,
                    dateTime: dateTime,
                    commentCount:commentCount || 0,
                    comments: comments,
                    isApplauded: isApplauded,
                    isYouTube: isYouTube,
                    youTubeId: video,
                    youTubeUrl: (isYouTube ? 'https://www.youtube.com/watch?v=' + video : ''),
                    fbLink: Global.url,
                    viewed: false,
                    thumbnail: Global.domain + '/stages/' + id + '/thumbnail/',
                    preload: 'none',
                    viewStage: function () {
                        return User.viewStage(this.id);
                    },
                    sources: sources
                };
            },

            /**
             * Asynchronous.
             * Log share.
             *
             * @param stageId int|string The Stage ID.
             * @returns {*} HTTP promise.
             */
            logShare: function (stageId) {
                return $http.post(Global.domain + '/daystage/stage/' + stageId + '/share', JSON.stringify({
                    userId: User.getUserId()
                }));
            },

            /**
             * Asynchronous.
             * Update stage description.
             *
             * @param stageId
             * @param description
             * @returns {*}
             */
            updateDescription: function (stageId, description) {
                return $http.put(Global.domain + '/stages/' + stageId, JSON.stringify({
                    description: description
                }));
            },

            /**
             * Asynchronous.
             * Delete stage.
             *
             * @param stageId
             * @returns {*}
             */
            deleteStage: function (stageId) {
                return $http.delete(Global.domain + '/stages/' + stageId);
            },

            /**
             * Asynchronous.
             * Update a comment.
             *
             * @param stageId
             * @param comment
             * @returns {*}
             */
            updateComment: function (stageId, comment) {
                return $http.put(Global.domain + '/stages/' + stageId + '/comment', JSON.stringify({
                    comment: comment
                }));
            },

            /**
             * Asynchronous.
             * Delete a comment.
             *
             * @param stageId
             * @returns {*}
             */
            deleteComment: function (stageId, comment) {
                return $http.delete(Global.domain + '/stages/' + stageId + '/comment');
            },

            /**
             * Report a video.
             *
             * @param stageId
             * @returns {*}
             */
            reportStage: function (stageId) {
                return $http.post(Global.domain + '/report/video', JSON.stringify({
                    stageId: stageId
                }));
            }

        }
    }
]);
