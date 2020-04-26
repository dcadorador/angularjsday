daystageApp.directive("postComments", [
    '$timeout',
    function ($timeout) {
        return {
            restrict: 'E',
            scope: { comments:"=" },
            templateUrl: "./views/partials/_postComments.html",
            link: function (scope, element, attributes) {
            }
        };
    }
]);
