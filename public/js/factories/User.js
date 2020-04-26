daystageApp.factory('User', [
    '$http',
    '$rootScope',
    'Global',
    '$window',
    'Upload',
    '$stateParams',
    function($http, $rootScope, Global, $window, Upload, $stateParams) {
        return {

            /**
             * Get the user id of the currently logged in user.
             *
             * @returns boolean|int
             */
            getUserId: function() {
                if (!this.isLoggedIn()) {
                    //throw new Error('No logged in user.');
                    return false;
                }
                return $window.localStorage.userId;
            },

            /**
             * Asynchronous.
             * Sign Up a User.
             *
             * @param firstName
             * @param lastName
             * @param email
             * @param password
             * @param birthDate
             * @param gender
             * @param fbToken
             * @returns {*} A promise with the http response.
             */
            signUp: function(firstName, lastName, email, password, birthDate, gender, fbToken) {
                return $http.post(Global.domain + '/users/add', JSON.stringify({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    birthdate: birthDate,
                    gender: gender,
                    youtubeLink: '',
                    facebookToken: fbToken,
                    facebookProfileLink: ''
                }));
            },

            /**
             * Asynchronous.
             * Login a user.
             *
             * @param email The user's email.
             * @param password The user's password.
             * @param facebookToken
             * @param firstname
             * @param lastname
             * @param profileImage
             * @param birthDay
             * @param country
             * @param city
             *
             * @returns $q A promise with the http response.
             *
             * @event EVENT_USER_LOGGING_IN a user is logging in.
             * @event EVENT_USER_LOGGED_IN after saving the login information of the user.
             */
            login: function(email, password, facebookToken, firstname,
                lastname, profileImage, birthDay, city, country) {

                $rootScope.$broadcast('EVENT_USER_LOGGING_IN');

                var data = {};

                if (typeof facebookToken != 'undefined') {
                    data = {
                        email: email,
                        password: password,
                        facebookToken: facebookToken,
                        firstname: firstname,
                        lastname: lastname,
                        profileImage: profileImage,
                        birthDay: birthDay,
                        city: city,
                        country: country,
                    };
                } else {
                    data = {
                        email: email,
                        password: password
                    };
                }

                return $http.post(Global.domain + '/login', JSON.stringify(data)).then(function(response) {

                    // success
                    if (response.data.status) {
                        $window.localStorage.userId = response.data.data.userId;
                        $window.localStorage.token = response.data.data.token;
                        $window.localStorage.expiration = response.data.data.expiration;
                        $window.localStorage.isLoggedIn = true;
                        $rootScope.$broadcast('EVENT_USER_LOGGED_IN');
                    }

                    return response;
                });
            },

            /**
             * Log-out the current user.
             *
             * @event EVENT_USER_LOGGED_OUT after resetting the login information of the user.
             */
            logout: function() {
                $window.localStorage.userId = undefined;
                $window.localStorage.token = undefined;
                $window.localStorage.expiration = undefined;
                $window.localStorage.isLoggedIn = false;

                $window.localStorage.hasCachedUserInfo = '0';

                $window.localStorage.user_firstName = undefined;
                $window.localStorage.user_lastName = undefined;
                $window.localStorage.user_birthdate = undefined;
                $window.localStorage.user_email = undefined;
                $window.localStorage.user_gender = undefined;
                $window.localStorage.user_profileImage = undefined;
                $window.localStorage.user_status = undefined;
                $window.localStorage.user_type = undefined;


                $window.localStorage.clear();

                $rootScope.$broadcast('EVENT_USER_LOGGED_OUT');


            },

            /**
             * Returns true if a user is logged in, otherwise false.
             *
             * @returns boolean
             */
            isLoggedIn: function() {

                // web storage can only store string
                return $window.localStorage.isLoggedIn == 'true';
            },

            /**
             * Asynchronous.
             * Submit a forgot-password request.
             *
             * @returns {*} A promise with the http response.
             */
            forgotPassword: function(email) {
                return $http.post(Global.domain + '/forgotPassword', JSON.stringify({
                    email: email
                }));
            },

            /**
             * Asynchronous.
             * Updates the user password.
             *
             * @param password
             * @param passwordRepeat
             */
            changePassword: function(password, passwordRepeat) {
                return $http.post(Global.domain + '/password', JSON.stringify({
                    token: $stateParams.token,
                    password: password,
                    password_confirmation: passwordRepeat
                }));
            },

            /**
             * Make a user object.
             * This is just to have a standards for users.
             *
             * @param id
             * @param email
             * @param firstName
             * @param lastName
             * @param birthDate
             * @param address
             * @param city
             * @param country
             * @param applauseCount
             * @param videoCount
             * @param followersCount
             * @param followingsCount
             * @param profilePicture
             * @param followed
             * @returns {*}
             */
            model: function(id, email, firstName, lastName, birthDate,
                address, city, country, applauseCount, videoCount,
                followersCount, followingsCount, profilePicture,
                followed) {
                return {
                    id: id,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    birthDate: birthDate,
                    address: address || 'Not specified',
                    city: city || 'Not specified',
                    country: country || 'Not specified',
                    applauseCount: applauseCount || 0,
                    videoCount: videoCount || 0,
                    followersCount: followersCount || 0,
                    followingsCount: followingsCount || 0,
                    profilePicture: profilePicture || 'images/default_profile_picture.png',
                    followed: followed
                };

            },

            /**
             * Get the cached user info.
             *
             * @returns {{firstName, lastName, birthdate, email, gender, profileImage}}
             */
            getUserInfo: function() {
                return {
                    id: $window.localStorage.userId,
                    firstName: $window.localStorage.user_firstName,
                    lastName: $window.localStorage.user_lastName,
                    birthdate: $window.localStorage.user_birthdate,
                    email: $window.localStorage.user_email,
                    gender: parseInt($window.localStorage.user_gender),
                    profileImage: $window.localStorage.user_profileImage || 'images/default_profile_picture.png',
                    status: $window.localStorage.user_status,
                    type: $window.localStorage.user_type,
                    city: $window.localStorage.user_city,
                    country: $window.localStorage.user_country,
                };
            },

            /**
             * If there is cached user info.
             *
             * @returns {boolean}
             */
            hasCachedUserInfo: function() {
                return $window.localStorage.hasCachedUserInfo == '1';
            },

            /**
             * Internal.
             * Sets the user info.
             *
             * @param values
             * @private
             */
            _setUserInfo: function(values) {
                $window.localStorage.hasCachedUserInfo = '1';
                $window.localStorage.user_firstName = values.firstName;
                $window.localStorage.user_lastName = values.lastName;
                $window.localStorage.user_birthdate = values.birthdate;
                $window.localStorage.user_email = values.email;
                $window.localStorage.user_gender = values.gender;
                $window.localStorage.user_profileImage = values.profileImage || 'images/default_profile_picture.png';
                $window.localStorage.user_status = values.status;
                $window.localStorage.user_type = values.type;
                $window.localStorage.user_city = values.city;
                $window.localStorage.user_country = values.country;
            },

            /**
             * Asynchronous.
             * Information about the current user.
             *
             * @returns {*} A promise with the http response.
             */
            userInfo: function() {

                var _this = this;
                var userId = _this.getUserId();
                if (!userId) return false;
                return $http.get(Global.domain + '/users/' + userId + '/info').then(function(response) {
                    if (response.data.status) {
                        _this._setUserInfo(response.data.data[0]);
                    }
                    return response;
                });
            },

            /**
             * Asynchronous.
             * Get another user's info.
             *
             * @param userId
             * @returns {*} A promise with the http response.
             */
            fetchUserInfo: function(userId) {

                var _this = this;
                if (!userId) return;
                return $http.get(Global.domain + '/users/' + userId + '/info').then(function(response) {

                    var data;

                    if (response.data.status) {
                        data = _this.model(
                            response.data.data[0].userId,
                            response.data.data[0].email,
                            response.data.data[0].firstName,
                            response.data.data[0].lastName,
                            response.data.data[0].birthdate,
                            response.data.data[0].address,
                            response.data.data[0].city,
                            response.data.data[0].country,
                            response.data.data[0].totalApplauses,
                            response.data.data[0].totalStages,
                            response.data.data[0].totalFollowers,
                            response.data.data[0].totalFollowings,
                            response.data.data[0].profileImage,
                            response.data.data[0].followed
                        );
                        data.isBirthYearHidden = (response.data.data[0].isBirthYearHidden == 1); // temporary, todo - add to user model
                    }

                    return {
                        isSuccess: response.data.status,
                        response: response,
                        data: data
                    };

                });
            },

            /**
             * Asynchronous.
             * The current user's profile and the top stages.
             *
             * @returns {*} A promise with the http response.
             */
            profile: function() {

                var _this = this;

                return $http.get(Global.domain + '/users/' + this.getUserId() + '/profile').then(function(response) {

                    var data;

                    if (response.data.status) {
                        _this._setUserInfo(response.data.data[0]);
                        data = _this.model(
                            response.data.data[0].userId,
                            response.data.data[0].email,
                            response.data.data[0].firstName,
                            response.data.data[0].lastName,
                            response.data.data[0].birthdate,
                            response.data.data[0].address,
                            response.data.data[0].city,
                            response.data.data[0].country,
                            response.data.data[0].totalApplauses,
                            response.data.data[0].totalStages,
                            response.data.data[0].totalFollowers,
                            response.data.data[0].totalFollowings,
                            response.data.data[0].profileImage,
                            response.data.data[0].followed
                        );
                    }
                    return {
                        isSuccess: response.data.status,
                        response: response,
                        data: data
                    };
                });
            },

            /**
             * Asynchronous.
             * Update the current user's profile.
             *
             * @param values The new values in the following format:
             * {
             *     firstName: 'Nick',
             *     lastName: 'Alcala',
             *     email: 'sample@sample.com',
             *     gender: '1',
             *     status: 'Active',
             *     city: 'Davao City',
             *     country: 'Philippines',
             *     profileImage: 'http://www.gravatar.com/avatar/7a4d586e0ed0c615a38f497215c7443b',
             *     youtubeLink: 'http://www.youtube.com/users/nickalcala',
             *     artist: {
             *         performerName: 'nick',
             *         categories: '1,2',
             *         facebookPageLink: 'http://www.facebook.com/pro.grammer.gamer',
             *         phoneNumber: '1234567890',
             *         email: 'sample@sample.com',
             *     }
             * }
             * @returns {*} A promise with the http response.
             * @event EVENT_USER_PROFILE_UPDATED When the API successfully updated the current user's profile.
             */
            updateProfile: function(values) {

                var _this = this;
                var status = values.status;
                status = status.charAt(0).toUpperCase() + status.slice(1);

                return Upload.upload({
                    url: Global.domain + '/users/' + this.getUserId() + '/info',
                    data: {
                        firstName: values.firstName,
                        lastName: values.lastName,
                        birthdate: values.birthDate,
                        email: values.email,
                        gender: values.gender,
                        status: status || 'Active',
                        city: values.city,
                        country: values.country,
                        profileImage: values.profileImage || '',
                        isBirthYearHidden: values.isBirthYearHidden || '',
                        youtubeLink: values.youtubeLink,
                        artist: {
                            performerName: values.performerName || "",
                            categories: values.categories || "",
                            facebookPageLink: values.facebookPageLink || "",
                            phoneNumber: values.phoneNumber || "",
                            email: values.email || ""
                        }
                    }
                }).then(function(response) {
                    // todo - fix promise
                    if (response.data.status) {
                        _this.userInfo().then(function() {
                            $rootScope.$broadcast('EVENT_USER_PROFILE_UPDATED');
                        });
                    }
                    return response;
                });
            },

            /**
             * Asynchronous.
             * Upload a stage. Refer to ng-file-upload.
             *
             * @param name
             * @param description
             * @param category
             * @param tags
             * @param videoFile
             * @returns {*}
             */
            uploadStage: function(name, description, category, tags, videoFile) {
                return Upload.upload({
                    url: Global.domain + '/stages/add',
                    data: {
                        userId: $window.localStorage.userId,
                        name: name,
                        description: description,
                        category: category,
                        tags: tags,
                        videoFile: videoFile
                    }
                }).then(function(response) {
                    $rootScope.$broadcast('events.stage.upload.ended');
                    return response;
                });
            },

            /**
             * Asynchronous.
             * Register the current user as artist.
             *
             * @param performerName
             * @param facebookPageLink
             * @param phoneNumber
             * @param email
             * @param categories
             * @returns {*} A promise with the http response.
             */
            toArtist: function(performerName, facebookPageLink, phoneNumber, email, categories) {
                var _this = this;
                return $http.post(Global.domain + '/artists/add', JSON.stringify({
                    userId: _this.getUserId(),
                    performerName: performerName,
                    facebookPageLink: facebookPageLink,
                    phoneNumber: phoneNumber,
                    email: email,
                    categories: categories
                })).then(function(response) {
                    $rootScope.$broadcast('EVENT_USER_TO_ARTIST');
                    return response;
                });
            },

            /**
             * Asynchronous.
             * Applause a stage.
             *
             * @param stageId
             * @returns {*} A promise with the http response.
             */
            applause: function(stageId) {
                var _this = this;
                return $http.post(Global.domain + '/stages/' + stageId + '/applause/add', JSON.stringify({
                    userId: _this.getUserId()
                })).then(function(response) {
                    $rootScope.$broadcast('events.stage.applaused', stageId);
                    return response;
                });
            },

            /**
             * Asynchronous.
             * Remove a stage applause.
             *
             * @param stageId
             * @returns {*} A promise with the http response.
             */
            removeApplause: function(stageId) {
                var _this = this;
                return $http({
                    method: 'DELETE',
                    url: Global.domain + '/stages/' + stageId + '/applause',
                    data: JSON.stringify({
                        userId: _this.getUserId()
                    })
                }).then(function(response) {
                    $rootScope.$broadcast('events.stage.unapplaused', stageId);
                    return response;
                });
            },

            /**
             * Asynchronous.
             * Comment on a stage.
             *
             * @param stageId
             * @param comment
             * @returns {*} A promise with the http response.
             */
            comment: function(stageId, comment) {
                var _this = this;
                return $http.post(Global.domain + '/stages/' + stageId + '/comment/add', JSON.stringify({
                    userId: _this.getUserId(),
                    comment: comment
                })).then(function(response) {
                    $rootScope.$broadcast('events.stage.add.comment', stageId);
                    return response;
                });
            },

            /**
             * Asynchronous.
             * Get stage comments.
             *
             * @param stageId
             * @returns {*} A promise with the http response.
             */
            getComments: function(stageId) {
                return $http.get(Global.domain + '/stages/' + stageId + '/comment');
            },

            /**
             * Asynchronous.
             * View a video and increment the stage's views count.
             *
             * @param stageId
             * @returns {*} A promise with the http response.
             */
            viewStage: function(stageId) {
                if (this.isLoggedIn()) {
                    return $http.post(Global.domain + '/stages/' + stageId + '/views', JSON.stringify({
                        ip: null,
                        status: 'active'
                    }));
                } else {
                    return $http.post(Global.domain + '/daystage/view', JSON.stringify({
                        stageId: stageId
                    }));
                }
            },

            /**
             * Asynchronous.
             * Hire a user.
             *
             * @param userIdToHire
             * @param phoneNo
             * @param description
             * @returns {*} A promise with the http response.
             */
            hireUser: function(userIdToHire, phoneNo, description) {
                var _this = this;
                return $http.post(Global.domain + '/users/' + _this.getUserId() + '/hire', JSON.stringify({
                    userId: userIdToHire,
                    phoneNo: phoneNo,
                    description: description
                }));
            },

            /**
             * Follow a user.
             *
             * @param userId
             * @returns {*} A promise with the http response.
             */
            follow: function(userId) {
                var _this = this;
                return $http.post(Global.domain + '/users/' + _this.getUserId() + '/following/add', JSON.stringify({
                    followedUserId: userId
                }));
            },

            /**
             * Un-follow a user.
             *
             * @param userId
             * @returns {*} A promise with the http response.
             */
            unFollow: function(userId) {
                var _this = this;
                return $http({
                    method: 'DELETE',
                    url: Global.domain + '/users/' + _this.getUserId() + '/following/remove',
                    data: JSON.stringify({
                        followedUserId: userId
                    })
                });
            },

            /**
             * Asynchronous.
             * Add one or more youtube videos.
             *
             * @param videos
             * @event events.stage.upload.ended
             * @returns {*} A promise with the http response.
             */
            addYouTubeVideos: function(videos) {
                var _this = this;
                return $http.post(Global.domain + '/stages/youtube/add', JSON.stringify({
                    userId: _this.getUserId(),
                    youtube: videos
                })).then(function(response) {
                    $rootScope.$broadcast('events.stage.uploadYouTube.ended');
                    return response;
                });
            },

            /**
             * Asynchronous.
             * Confirm the user's email associated with the token.
             *
             * @param token
             * @returns {*} A promise with the http response.
             */
            confirm: function(token) {
                return $http.post(Global.domain + '/confirm', JSON.stringify({
                    token: token
                }));
            },

            /**
             * Asynchronous.
             * User answer the survey question
             *
             * @param answer
             * @returns {*} A promise with the http response.
             */
            answerSurvey: function(answer) {
                var _this = this;
                return $http.post(Global.domain + '/survey', JSON.stringify({
                    userId: _this.getUserId(),
                    answer: answer
                }));
            },

            /**
             * Added by Andrew Adorador
             * This is to send feedback email to Dror and Or.
             *
             * @param type
             * @param feedback
             * @param sender
             * @returns {HttpPromise}
             */
            feedback: function(type, feedback, sender) {
                return $http.post(Global.domain + '/help/feedback', JSON.stringify({
                    type: type,
                    feedback: feedback,
                    firstname: sender.firstname,
                    lastname: sender.lastname,
                    email: sender.email
                }));
            },

            /**
             *  Added by Drew
             *
             * @param type
             * @param feedback
             * @param sender
             * @returns {*}
             */
            unsubscribe: function(user) {
                return $http.post(Global.domain + '/users/unsubscribe', JSON.stringify({
                    email: user.email
                }));
            }

        }; // End - User Object
    }
]);
