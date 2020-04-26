daystageApp.factory('ServerErrorProvider', [
    function () {

        /**
         * Populates the {errorsContainer} with an array of errors
         * from {serverResponseInternal}.
         *
         * @param serverResponseInternal
         */
        var fn = function (serverResponseInternal) {

            var errorsContainer = [];

            angular.forEach(serverResponseInternal, function (value, key) {
                errorsContainer.push(value[0]);
            });

            return errorsContainer;
        };

        return fn;
    }
]);
