daystageApp.directive('artistSignup', [
    'User',
    'DialogHelper',
    function (User, DialogHelper) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_artistSignup.html',
            link: function (scope, element, attributes) {

                scope.signingUp = false;

                scope.toArtist = function () {

                    if (scope.ArtistSignUpForm.$valid) {
                        scope.signingUp = true;

                        User.toArtist(scope.artist.name, scope.artist.fbLink,
                            scope.artist.phone, scope.artist.email,
                            scope.artist.categories).then(function (response) {

                            if (response.data.status) {
                                scope.signingUp = false;

                                DialogHelper.showBasic(
                                    scope,
                                    undefined,
                                    'Upload Stage',
                                    '<upload-stage></upload-stage>',
                                    undefined,
                                    {clickOutsideToClose: false},
                                    {width: 70}
                                );
                            } else {
                                alert('error');
                            }

                            DialogHelper.close();
                        });
                    }

                };

            }
        };
    }
]);
