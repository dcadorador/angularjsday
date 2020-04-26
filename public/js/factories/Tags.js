daystageApp.factory('Tags', [
    'Global',
    '$http',
    function (Global, $http) {
        return {

            /**
             * Todo fetch from API
             *
             * @param q string The search key word.
             * @returns {*}
             */
            getTags: function (q) {
                return $http.get(Global.domain + '/tags?q=' + q);
            }

        };
    }
]);
