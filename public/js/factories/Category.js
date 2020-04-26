daystageApp.factory('Category', [
    'Global',
    '$http',
    function (Global, $http) {
        return {

            /**
             * Asynchronous.
             * Get all categories.
             *
             * @returns {*}
             */
            getCategories: function () {
                return $http.get(Global.domain + '/categories');
            }

        };
    }
]);
