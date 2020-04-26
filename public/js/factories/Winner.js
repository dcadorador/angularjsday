daystageApp.factory('Winner', [
    'Global',
    '$http',
    'User',
    'Stage',
    function (Global, $http, User, Stage) {
        return {

            /**
             * Asynchronous.
             * Get the winner for today.
             *
             * @returns {*} A promise with the http response.
             */
            getWinner: function () {
                return $http.get(Global.domain + '/daystage/winner').then(function (response) {

                    var winner = null;

                    if (response.data.status) {
                        winner = {
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
                    }

                    return {
                        isSuccess: response.data.status,
                        response: response,
                        data: winner
                    };

                });
            }

        };
    }
]);
