/**
 * Todo - cleanup, use promises, avoid events :D
 */
daystageApp.factory('YouTube', [
    'Global',
    '$window',
    '$q',
    '$rootScope',
    function (Global, $window, $q, $rootScope) {
        return {

            OAUTH2_CLIENT_ID: undefined,
            OAUTH2_SCOPES: undefined,

            cachedVideos: [],

            initialize: function () {
                var _this = this;
                _this._init();

                var deferred = $q.defer();

                $rootScope.$broadcast('events.youtube.waiting', true);
                angular.element.getScript('https://apis.google.com/js/client.js?onload=googleApiClientReady', function () {
                    deferred.resolve(arguments);
                    $rootScope.$broadcast('events.youtube.waiting', false);
                });

                return deferred.promise;
            },

            _init: function () {

                // The client ID is obtained from the Google Developers Console
                // at https://console.developers.google.com/.
                // If you run this code from a server other than http://localhost,
                // you need to register your own client ID.

                var _this = this;

                this.OAUTH2_CLIENT_ID = Global.youTubeClientId;
                this.OAUTH2_SCOPES = [
                    'https://www.googleapis.com/auth/youtube'
                ];

                // Upon loading, the Google APIs JS client automatically invokes this callback.
                $window.googleApiClientReady = function () {
                    gapi.auth.init(function () {
                        window.setTimeout(checkAuth, 1);
                    });
                };

                // Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
                // If the currently logged-in Google Account has previously authorized
                // the client specified as the OAUTH2_CLIENT_ID, then the authorization
                // succeeds with no user intervention. Otherwise, it fails and the
                // user interface that prompts for authorization needs to display.
                $window.checkAuth = function () {
                    gapi.auth.authorize({
                        client_id: _this.OAUTH2_CLIENT_ID,
                        scope: _this.OAUTH2_SCOPES,
                        immediate: true
                    }, handleAuthResult);
                };

                // Handle the result of a gapi.auth.authorize() call.
                $window.handleAuthResult = function (authResult) {
                    if (authResult && !authResult.error) {

                        // logged in
                        $rootScope.$broadcast('events.youtube.auth.success');

                        // Authorization was successful. Hide authorization prompts and show
                        // content that should be visible after authorization succeeds.
                        // $('.pre-auth').hide();
                        // $('.post-auth').show();
                        loadAPIClientInterfaces();
                    } else {

                        // not logged in
                        $rootScope.$broadcast('events.youtube.auth.fail');

                        // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
                        // client flow. The current function is called when that flow completes.
                        // $('#login-link').click(function () {
                        //     gapi.auth.authorize({
                        //         client_id: OAUTH2_CLIENT_ID,
                        //         scope: OAUTH2_SCOPES,
                        //         immediate: false
                        //     }, handleAuthResult);
                        // });
                    }
                };

                // Load the client interfaces for the YouTube Analytics and Data APIs, which
                // are required to use the Google APIs JS client. More info is available at
                // http://code.google.com/p/google-api-javascript-client/wiki/GettingStarted#Loading_the_Client
                $window.loadAPIClientInterfaces = function () {
                    gapi.client.load('youtube', 'v3', function () {
                        handleAPILoaded();
                    });
                };

                // Define some variables used to remember state.
                var playlistId, nextPageToken, prevPageToken;

                // After the API loads, call a function to get the uploads playlist ID.
                $window.handleAPILoaded = function () {
                    requestUserUploadsPlaylistId();
                };

                // Call the Data API to retrieve the playlist ID that uniquely identifies the
                // list of videos uploaded to the currently authenticated user's channel.
                $window.requestUserUploadsPlaylistId = function () {
                    // See https://developers.google.com/youtube/v3/docs/channels/list
                    var request = gapi.client.youtube.channels.list({
                        mine: true,
                        part: 'contentDetails'
                    });
                    request.execute(function (response) {
                        playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
                        requestVideoPlaylist(playlistId);
                    });
                };

                // Retrieve the list of videos in the specified playlist.
                $window.requestVideoPlaylist = function (playlistId, pageToken) {
                    // $('#video-container').html('');
                    var requestOptions = {
                        playlistId: playlistId,
                        part: 'snippet',
                        maxResults: 50
                    };
                    if (pageToken) {
                        requestOptions.pageToken = pageToken;
                    }

                    $rootScope.$broadcast('events.youtube.waiting', true);

                    var request = gapi.client.youtube.playlistItems.list(requestOptions);
                    request.execute(function (response) {

                        $rootScope.$broadcast('events.youtube.data.loaded', response.result.items);
                        $rootScope.$broadcast('events.youtube.waiting', false);

                        // Only show pagination buttons if there is a pagination token for the
                        // next or previous page of results.
                        // nextPageToken = response.result.nextPageToken;
                        // var nextVis = nextPageToken ? 'visible' : 'hidden';
                        // $('#next-button').css('visibility', nextVis);
                        // prevPageToken = response.result.prevPageToken
                        // var prevVis = prevPageToken ? 'visible' : 'hidden';
                        // $('#prev-button').css('visibility', prevVis);
                        //
                        // var playlistItems = response.result.items;
                        // if (playlistItems) {
                        //     $.each(playlistItems, function (index, item) {
                        //         displayResult(item.snippet);
                        //     });
                        // } else {
                        //     $('#video-container').html('Sorry you have no uploaded videos');
                        // }
                    });
                };

                // Create a listing for a video.
                $window.displayResult = function (videoSnippet) {
                    var title = videoSnippet.title;
                    var videoId = videoSnippet.resourceId.videoId;
                    $('#video-container').append('<p>' + title + ' - ' + videoId + '</p>');
                };

                // Retrieve the next page of videos in the playlist.
                $window.nextPage = function () {
                    requestVideoPlaylist(playlistId, nextPageToken);
                };

                // Retrieve the previous page of videos in the playlist.
                $window.previousPage = function () {
                    requestVideoPlaylist(playlistId, prevPageToken);
                };

            }, //auth

            authenticate: function () {

                var _this = this;

                gapi.auth.authorize({
                    client_id: _this.OAUTH2_CLIENT_ID,
                    scope: _this.OAUTH2_SCOPES,
                    immediate: false
                }, handleAuthResult);
            },

            addToCache: function (videos) {
                this.cachedVideos = videos;
                $rootScope.$broadcast('events.youtube.videosCached', this.cachedVideos);
            },

            getCachedVideo: function () {
                return this.cachedVideos;
            },

            model: function (title, id, description) {
                return {
                    name: title,
                    video: id,
                    description: description,
                    thumbnail: 'https://img.youtube.com/vi/' + id + '/mqdefault.jpg'
                };
            }

        };
    }
]);
