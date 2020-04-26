/**
 * AuthInterceptor Factory
 *
 * An interceptor that adds the "Authorization: Bearer theUserToken123"
 * to the Request Header using the built-in $http service of angular.
 */
daystageApp.factory('AuthInterceptor', [
        '$q',
        '$window',
        '$location',
        function($q, $window, $location) {
            return {
                request: function(config) {
                    if ($window.localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                    }
                    return config;
                },
                responseError: function(rejection) {
                    if (rejection.status === 401) {
                        $location.path('/home').replace();
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);
