daystageApp.factory('TopTen', [
    'Global',
    '$http',
    'User',
    'Stage',
    function (Global, $http, User, Stage) {
        return {

            /**
             * Asynchronous.
             * Get the top ten stages.
             *
             * @returns {*} A promise with the http response.
             */
            all: function () {
                return $http.get(Global.domain + '/daystage/top').then(function (response) {

                    var stages = [];

                    if (response.data.status) {
                        angular.forEach(response.data.data, function (stage, index) {
                            stages.push({
                                user: User.model(
                                    stage.user.id,
                                    stage.user.email,
                                    stage.user.firstName,
                                    stage.user.lastName,
                                    stage.user.birthDate,
                                    stage.user.address,
                                    stage.user.city,
                                    stage.user.country,
                                    stage.user.applauseCount,
                                    stage.user.videoCount,
                                    stage.user.followersCount,
                                    stage.user.followingsCount,
                                    stage.user.profilePicture,
                                    stage.user.followed
                                ),
                                stage: Stage.model(
                                    stage.stage.id,
                                    stage.stage.description,
                                    stage.stage.category,
                                    stage.stage.tags,
                                    stage.stage.video,
                                    stage.stage.applauseCount,
                                    stage.stage.commentCount,
                                    stage.stage.viewsCount,
                                    stage.stage.dateTime,
                                    stage.stage.comments,
                                    stage.stage.isApplauded
                                )
                            });
                        });
                    } else {
                        stages = [];
                    }

                    return {
                        isSuccess: response.data.status,
                        response: response,
                        data: stages
                    };
                });
            }

        };
    }
]);
