daystageApp.directive('backgroundImg',[
    '$timeout',
    function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                var loadImage = function () {
                    var url = attrs.backgroundImg;
                    element.css('background-image','url("' + url + '")');
                };

                scope.$watch(function () {
                    return attrs.backgroundImg;
                }, function () {
                    loadImage();
                });

                $timeout(function () {
                    loadImage();
                });

            }
        }
    }
]);
