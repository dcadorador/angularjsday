daystageApp.directive('userInfo', [

    function () {
        return {
            restrict: 'E',
            templateUrl: '../views/partials/_userInfo.html',
            scope: { user:'=' },
            link: function (scope, element, attributes) {
            }
        };
    }
]);
