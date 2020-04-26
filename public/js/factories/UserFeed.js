daystageApp.factory('UserFeed', [
    'Global',
    'User',
    'Stage',
    '$http',
    function(Global, User, Stage, $http) {
        return {

            userId: null,
            filter: null,
            sort: null,
            isLoading: false,
            currentPage: 1,
            hasMorePages: false,
            perPage: 3,
            items: [],
            loading: {},
            /**
             * Asynchronous.
             * Gets the user's feed.
             *
             * @returns {*} A promise with the http response.
             */
            getUserFeed: function() {
                return $http.get(Global.domain + '/daystage/feed');
            },

            /**
             * Asynchronous.
             * Filter and sort the user feed.
             *
             * @param filter
             * @param sort
             * @param userId
             * @returns {*} A promise with the http response.
             */
            filterUserFeed: function(filter, sort, userId) {
                console.log('filterUserFeed', filter, sort, userId);

                var _this = this;
                if (_this.loading[filter + sort + userId] == undefined || _this.loading[filter + sort + userId] == false)
                    _this.loading[filter + sort + userId] = true;
                else
                    return null;

                _this.userId = userId;

                _this.items = [];
                _this.filter = filter;
                _this.sort = sort;

                return $http.get(Global.domain + '/daystage/feed?type=' + filter + '&sort=' + sort + '&user-id=' + _this.userId).then(function(response) {
                    _this.loading[filter + sort + userId] = false;
                    _this._populate(response);
                    return _this.items;
                });
            },

            _populate: function(response) {

                var _this = this;
                var items = [];

                if (_this.filter == 'follower' || _this.filter == 'following') {
                    items = response.data.data;
                } else {
                    items = response.data.data.items;
                    _this.currentPage = response.data.data.currentPage;
                    _this.hasMorePages = response.data.data.hasMorePages;
                    _this.perPage = response.data.data.perPage;
                }

                angular.forEach(items, function(feed, index) {
                    if (_this.filter == 'follower' || _this.filter == 'following') {
                        _this.items.push(User.model(
                            feed.id,
                            feed.email,
                            feed.firstName,
                            feed.lastName,
                            feed.birthDate,
                            feed.address,
                            feed.city,
                            feed.country,
                            feed.applauseCount,
                            feed.commentCount,
                            feed.videoCount,
                            feed.followersCount,
                            feed.followingsCount,
                            feed.profilePicture
                        ));
                    } else {
                        _this.items.push({
                            user: User.model(
                                feed.user.id,
                                feed.user.email,
                                feed.user.firstName,
                                feed.user.lastName,
                                feed.user.birthDate,
                                feed.user.address,
                                feed.user.city,
                                feed.user.country,
                                feed.user.applauseCount,
                                feed.user.videoCount,
                                feed.user.followersCount,
                                feed.user.followingsCount,
                                feed.user.profilePicture,
                                feed.user.followed
                            ),
                            stage: Stage.model(
                                feed.stage.id,
                                feed.stage.description,
                                feed.stage.category,
                                feed.stage.tags,
                                feed.stage.video,
                                feed.stage.applauseCount,
                                feed.stage.commentCount,
                                feed.stage.viewsCount,
                                feed.stage.dateTime,
                                feed.stage.comments,
                                feed.stage.isApplauded
                            )
                        });
                    }
                });
            },

            /**
             * Asynchronous.
             * Go to next page.
             *
             * @returns {*} A promise with the http response.
             */
            nextPage: function() {
                var _this = this;
                return $http.get(Global.domain + '/daystage/feed?page=' + (_this.currentPage + 1) + '&type=' + _this.filter + '&sort=' + _this.sort + '&user-id=' + _this.userId).then(function(response) {
                    _this.isLoading = false;
                    _this._populate(response);
                    return _this.items;
                });
            }

        };
    }
]);
