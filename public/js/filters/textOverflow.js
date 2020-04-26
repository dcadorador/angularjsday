daystageApp.filter('textOverflow', [
    function () {
        return function (input, limit) {

            if (input) {
                if (input.length > limit)
                    return input.substring(0, limit) + ' ...';
            }

            return input;
        };
    }
]);
