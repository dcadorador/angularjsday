daystageApp.factory('FeaturedVideo', [
    'Winner',
    '$rootScope',
    function (Winner, $rootScope) {
        return {

            /**
             * The featured stage.
             */
            stage: null,

            isWinner: false,

            /**
             * Set the featured video.
             *
             * @param stage Stage
             * @param isWinner bool
             * @event events.featured.changed
             */
            setFeaturedVideo: function (stage, isWinner) {
                this.stage = stage;
                this.isWinner = isWinner;
                $rootScope.$broadcast('events.featured.changed');
            },

            /**
             * Set the featured video to the winner stage.
             *
             * @returns {*} The http promise with the Winner.getWinner() response
             * @event events.featured.changed
             */
            setFeaturedVideoToWinner: function () {
                var _this = this;
                return Winner.getWinner().then(function (response) {
                    _this.setFeaturedVideo(response.data, true);
                    return response;
                });
            }

        };
    }
]);
