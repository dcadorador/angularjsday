daystageApp.factory('Google', [
    'Global',
    '$q',
    function (Global, $q) {
        return {

            initialize: function () {

                var deferred = $q.defer();

                angular.element.getScript('https://maps.googleapis.com/maps/api/js?key=' + Global.googleApiKey + '&libraries=places', function () {
                    deferred.resolve(arguments);
                });

                return deferred.promise;
            }

        };
    }
]);
