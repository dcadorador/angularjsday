daystageApp.directive('fbSignup', [
    'Facebook',
    'DialogHelper',
    'User',
    function (Facebook, DialogHelper, User) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {

                scope.signingUp = false;

                scope.$on('EVENTS_SIGNUP', function () {
                    User.login(Facebook.email, Facebook.email);
                });

                element.bind("click", function (e) {
                    scope.signingUp = true;
                    Facebook.fbSignup().then(function (response) {
                        if(!response){
                            return;
                        }
                        console.log('response', response);

                        if (response.data.status) {
                        } else {
                            DialogHelper.showBasic(
                                scope,
                                undefined,
                                'Failed',
                                "<p><strong>Oops!</strong> something went wrong.</p>" +
                                "<p>"+response.data.data.internal.email[0]+"</p>" +
                                "<button class='btn btn-yellow btn-lg' ng-click='cancel()'>Ok</button>",
                                undefined,
                                undefined,
                                {width:50}
                            );
                        }

                        scope.signingUp = false;
                    });
                });
            }
        };
    }
]);
