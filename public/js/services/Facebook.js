daystageApp.factory('Facebook', [
    'Global',
    '$window',
    'User',
    '$q',
    '$rootScope',
    function(Global, $window, User, $q, $rootScope) {
        return {

            status: '',
            accessToken: '',
            email: '',

            /**
             * Asynchronous.
             * Initialize the facebook sdk and set some configurations.
             * @return void
             */
            initialize: function() {

                var _this = this;

                // download sdk
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);

                    _this._init();

                }(document, 'script', 'facebook-jssdk'));


                // initialize sdk configurations
                $window.fbAsyncInit = function() {
                    FB.init({
                        appId: Global.facebookClientId,
                        cookie: true,
                        xfbml: true,
                        version: 'v2.5'
                    });
                };

            },

            /**
             * Internal.
             * Initialize global functions so facebook sdk will
             * be able to use it. Facebook can't access these method
             * if its encapsulated inside the angular app.
             *
             * @private
             */
            _init: function() {

                $window.fbAuthenticate = this.fbAuthenticate;
                $window.fbShare = this.fbShare;

            },

            /**
             * Asynchronous.
             * Authenticate user to facebook.
             */
            fbAuthenticate: function() {
                var _this = this;
                FB.getLoginStatus(function(response) {

                    _this.status = response.status;
                    _this.accessToken = response.accessToken;

                    FB.api('/me', function(response) {});

                });
            },

            /**
             * Asynchronous.
             * Facebook share UI.
             *
             * @param stage
             * @param user
             * @param type 'winner', 'top', 'others'
             * instead of linking to public vote page.
             */
            fbShare: function(stage, user, type) {
                var link = Global.url;
                // switch (type) {
                //     case 'winner':
                //         link = Global.url;
                //         break;
                //     case 'top':
                //         link = Global.url + '/?sid='+stage.id;
                //         break;
                //     default:
                //         link = Global.url + '/vote-video?sid='+stage.id;
                // }

                link = Global.url + '/vote-video?sid=' + stage.id;

                console.log('stage', stage);

                var name = user.firstName + ' ' + user.lastName;

                var feed = {
                    method: 'feed',
                    link: link,
                    picture: Global.domain + '/stages/' + stage.id + '/fbthumbnail',
                    name: name ? name + ' on Daystage' : 'Daystage',
                    description: stage.description,
                    source: stage.isYouTube ? stage.youTubeUrl : stage.video,
                    caption: '',
                    type: 'video',
                    display: 'popup',
                    hashtag: '#daystage'
                };
                FB.ui(feed, function(response) {
                    $rootScope.$broadcast('events.facebook.share', stage);
                });
            },

            /**
             * Asynchronous.
             * Facebook sign-up.
             *
             * @returns {*} A promise with the http response.
             */
            fbSignup: function() {

                var _this = this;

                return this.fbGetProfile().then(function(response) {
                    var deferred = $q.defer();

                    _this.email = response.email;

                    var location = [];




                    if (typeof response.user.location != 'undefined')
                        location = response.user.location.name.split(',');

                    if (typeof response.user.hometown != 'undefined')
                        location = response.user.hometown.name.split(',');

                    if (response.user.email == undefined) {
                        var userData = {
                            firstName: response.user.first_name,
                            lastName: response.user.last_name,
                            picture: response.user.picture.data.url,
                            city: location[0],
                            country: location[0]
                        };

                        $rootScope.$broadcast('EVENT_FACEBOOK_UNVERIFIED', userData);

                        return;
                    }

                    User.login(
                        response.user.email,
                        response.user.email,
                        response.authentication.authResponse.accessToken,
                        response.user.first_name,
                        response.user.last_name,
                        response.user.picture.data.url,
                        response.user.birthday,
                        location[0] || '',
                        location[1] || ''
                    ).then(function(response) {
                        deferred.resolve(response);
                    }, function(response) {
                        deferred.reject('Error occurred');
                    });
                    //(email, password, facebookToken, firstname, lastname, profileImage)

                    // User.signUp(
                    //     response.user.first_name,
                    //     response.user.last_name,
                    //     response.user.email,
                    //     response.user.email,
                    //     '',
                    //     (response.user.gender=='male' ? 1 : 0),
                    //     response.authentication.authResponse.accessToken
                    // ).then(function (response) {
                    //     deferred.resolve(response);
                    // }, function (response) {
                    //     deferred.reject('Error occurred');
                    // });
                    return deferred.promise;
                });
            },

            /**
             * Asynchronous.
             * Facebook profile.
             *
             * @returns {*} A promise with the http response.
             */
            fbGetProfile: function() {
                return this.fbLogin().then(function(response) {
                    var loginResponse = response;
                    var deferred = $q.defer();
                    FB.api('/me', {
                        fields: 'first_name,last_name,email,gender,picture,location,hometown,birthday'
                    }, function(response) {
                        if (!response || response.error) {
                            deferred.reject('Error occurred');
                        } else {
                            deferred.resolve({
                                authentication: loginResponse,
                                user: response
                            });
                        }
                    });
                    return deferred.promise;
                });
            },

            /**
             * Asynchronous.
             * Facebook login UI.
             *
             * @returns {*} A promise with the http response.
             */
            fbLogin: function() {
                var deferred = $q.defer();
                FB.login(function(response) {
                    if (!response || response.error) {
                        deferred.reject('Error occurred');
                    } else {
                        deferred.resolve(response);
                    }

                }, {
                    scope: 'public_profile,email,user_birthday,user_location,user_hometown'
                });
                return deferred.promise;
            },

            /**
             * If the user is authenticated in our facebook app.
             * @returns {boolean}
             */
            isAuthenticated: function() {
                return this.status == 'connected';
            },

        };
    }
]);
