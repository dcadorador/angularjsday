daystageApp.directive('editUserProfile', [
    'DateProvider',
    'User',
    'DialogHelper',
    '$window',
    '$timeout',
    '$state',
    '$rootScope',
    'Google',
    function (DateProvider, User, DialogHelper, $window, $timeout, $state, $rootScope, Google) {
        return {
            restrict: 'E',
            templateUrl: './views/partials/_edit-user-profile.html',
            link: function (scope, element, attributes) {
                scope.isLoading = true;


                $timeout(function () {

                    if (typeof google == 'undefined') {
                        Google.initialize().then(function (response) {
                            scope.initAutocomplete();
                        });
                    } else {
                        scope.initAutocomplete();
                    }

                    scope.userInfo();

                });

                /*
                 * start - google api for searching of places
                 * todo encapsulate to its own directive
                 */
                // This example displays an address form, using the autocomplete feature
                // of the Google Places API to help users fill in the information.

                // This example requires the Places library. Include the libraries=places
                // parameter when you first load the API. For example:
                // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
                var placeSearch, autocomplete;
                var componentForm = {
                    locality: 'long_name',
                    country: 'long_name'
                };

                scope.initAutocomplete = function () {
                    // Create the autocomplete object, restricting the search to geographical
                    // location types.
                    autocomplete = new google.maps.places.Autocomplete(
                        /** @type {!HTMLInputElement} */(document.getElementById('search-place')),
                        {types: ['geocode']});

                    // When the user selects an address from the dropdown, populate the address
                    // fields in the form.
                    autocomplete.addListener('place_changed', scope.fillInAddress);
                };

                scope.fillInAddress = function () {
                    // Get the place details from the autocomplete object.
                    var place = autocomplete.getPlace();

                    for (var component in componentForm) {
                        scope[component] = '';
                    }

                    // Get each component of the address from the place details
                    // and fill the corresponding field on the form.
                    for (var i = 0; i < place.address_components.length; i++) {
                        var addressType = place.address_components[i].types[0];

                        var property = '';

                        if (addressType == 'locality' || addressType == 'country') {
                            property = addressType;

                            if (property == 'locality')
                                property = 'city';


                            var value = place.address_components[i][componentForm[addressType]];

                            scope.$apply(function () {
                                scope.userEdit[property] = value;
                            });
                        }

                    }
                };

                // Bias the autocomplete object to the user's geographical location,
                // as supplied by the browser's 'navigator.geolocation' object.
                scope.geolocate = function () {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var geolocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            var circle = new google.maps.Circle({
                                center: geolocation,
                                radius: position.coords.accuracy
                            });
                            autocomplete.setBounds(circle.getBounds());
                        });
                    }
                };

                /*
                 * end - google api for searching of places
                 */


                scope.userEdit = {};
                scope.userOrig = {};

                scope.days = [];
                scope.months = [];
                scope.years = [];

                scope.months = DateProvider.months();
                scope.years = DateProvider.years();
                scope.days = DateProvider.days(scope.userEdit, 'birthDay', scope.userEdit.birthMonth, scope.userEdit.birthYear);
                scope.$watch(['user.birthMonth', 'user.birthYear'], function () {
                    scope.days = DateProvider.days(scope.userEdit, 'birthDay', scope.userEdit.birthMonth, scope.userEdit.birthYear);
                }, true);

                scope.userInfo = function () {
                    User.userInfo()
                        .then(function (response) {

                            if (response.data.status) {

                                scope.userOrig = response.data.data[0];

                                scope.userEdit.firstName = User.getUserInfo().firstName;
                                scope.userEdit.lastName = User.getUserInfo().lastName;
                                scope.userEdit.city = User.getUserInfo().city;
                                scope.userEdit.country = User.getUserInfo().country;
                                var birthDate = new Date(User.getUserInfo().birthdate);
                                scope.userEdit.birthMonth = birthDate.getMonth() || undefined;
                                scope.userEdit.birthDay = birthDate.getDate() || undefined;
                                scope.userEdit.birthYear = birthDate.getFullYear() || undefined;
                                scope.userEdit.profileImage = User.getUserInfo().profileImage;
                                scope.userEdit.isBirthYearHidden = scope.userOrig.isBirthYearHidden == 1;
                                if (scope.userEdit.birthMonth) {
                                    scope.userEdit.birthMonth++;
                                    scope.userEdit.birthMonth = scope.userEdit.birthMonth <= 9 ? '0' + scope.userEdit.birthMonth : scope.userEdit.birthMonth;
                                }

                                scope.userEdit.birthDay = scope.userEdit.birthDay <= 9 ? '0' + scope.userEdit.birthDay : scope.userEdit.birthDay;

                            } else {
                                alert('An error occurred.');
                            }
                            scope.isLoading = false;
                        }, function (response) {
                            alert('An error occurred.');
                        });
                };

                scope.editProfile = function () {
                    if (scope.EditProfileForm.$valid) {

                        $rootScope.$broadcast('EVENTS_DIALOG_LOADING');
                        scope.isLoading = true;

                        User.updateProfile({
                                firstName: scope.userEdit.firstName,
                                lastName: scope.userEdit.lastName,
                                email: User.getUserInfo().email,
                                gender: User.getUserInfo().gender,
                                city: scope.userEdit.city,
                                country: scope.userEdit.country,
                                status: scope.userOrig.status || 'Active',
                                profileImage: scope.userEdit.profileImage,
                                isBirthYearHidden: scope.userEdit.isBirthYearHidden,
                                birthDate: scope.userEdit.birthYear + '-' + scope.userEdit.birthMonth + '-' + scope.userEdit.birthDay,
                                artist: {
                                    performerName: scope.userOrig.artist.performerName,
                                    categories: scope.userOrig.artist.categories,
                                    facebookPageLink: scope.userOrig.artist.facebookPageLink,
                                    phoneNumber: scope.userOrig.artist.phoneNumber,
                                    email: scope.userOrig.artist.email
                                }
                            })
                            .then(function (response) {
                                scope.isLoading = false;

                                $rootScope.$broadcast('EVENTS_DIALOG_NOT_LOADING');
                                if (response.data.status) {
                                    if (scope.userEdit.youtubeLink) {
                                        DialogHelper.showBasic(
                                            scope, undefined,
                                            'Select YouTube Videos',
                                            '<you-tube-videos method="upload"></you-tube-videos>'
                                        );
                                    } else {
                                        DialogHelper.showBasic(
                                            scope,
                                            undefined,
                                            'Success',
                                            'Profile successfully updated.'
                                        );
                                        $state.go('user-profile', {userId: 'home'});
                                    }
                                } else {
                                    alert('An error occurred.');
                                }
                            }, function (response) {
                                $rootScope.$broadcast('EVENTS_DIALOG_NOT_LOADING');
                                alert('An error occurred.');
                            });
                    }
                };
            }
        };
    }
]);
