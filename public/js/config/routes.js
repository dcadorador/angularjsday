/**
 * Configure the routes.
 */
 angular.module('DayStage')

 .config(["$locationProvider", function($locationProvider) {
     $locationProvider.html5Mode(true);
 }])

 .config([
     '$stateProvider',
     '$urlRouterProvider',
     function($stateProvider, $urlRouterProvider) {

         $urlRouterProvider.when('', '/');

         /**
          * requireLogin - Boolean, Optional. Redirect to home page/sign-up page when user is not logged in.
          * loggedInAltState - String, Optional. Redirect URL when there is user logged in.
          */
         $stateProvider

             .state('home', {
             url: "/?sid",
             templateUrl: "./views/home.html",
             loggedInAltState: 'home-logged-in'
         })

         .state('signup', {
             url: "/signup",
             templateUrl: "./views/signup.html",
             loggedInAltState: 'home-logged-in',
             controller: [
                 '$scope',
                 function($scope) {
                     $scope.mbHeaderTitle = 'Sign Up it\'s free.';
                 }
             ]
         })

         .state('topten', {
             url: "/topten",
             templateUrl: "./views/topten.html",
             requireLogin: true,
             controller: [
                 'TopTen',
                 'User',
                 '$scope',
                 '$timeout',
                 function(TopTen, User, $scope, $timeout) {
                     $timeout(function() {
                         TopTen.all().then(function(response) {
                             $scope.posts = response.data;
                         });
                     });

                     $scope.applause = function(stage) {
                         $scope.applauseToggling = true;
                         User.applause(stage.id).then(function(response) {
                             stage.isApplauded = true;
                             stage.applauseCount++;
                             $scope.applauseToggling = false;
                         });
                     };

                     $scope.removeApplause = function(stage) {
                         $scope.applauseToggling = true;
                         User.removeApplause(stage.id).then(function(response) {
                             stage.isApplauded = false;
                             stage.applauseCount--;
                             $scope.applauseToggling = false;
                         });
                     };

                 }
             ]
         })

         .state('home-logged-in', {
             url: "/home?sid",
             templateUrl: "./views/home-logged-in.html",
             requireLogin: true
         })

         .state('search', {
             url: "/search",
             params: {
                 q: null,
                 type: null,
             },
             templateUrl: "./views/search.html",
             requireLogin: true,
             controller: [
                 '$scope',
                 '$stateParams',
                 function($scope, $stateParams) {

                     $scope.query = $stateParams.q || $stateParams.location;
                     $scope.searchType = $stateParams.type || 'stage';

                 }
             ]
         })

         .state('terms-of-service', {
             url: "/terms-of-service",
             templateUrl: "./views/terms-of-service.html"
         })

         .state('privacy-policy', {
             url: "/privacy-policy",
             templateUrl: "./views/privacy-policy.html"
         })

         .state('faq', {
             url: "/faq",
             templateUrl: "./views/faq.html"
         })

         .state('unsubscribe', {
             url:"/unsubscribe",
             templateUrl: "./views/unsubscribe.html",
             controller: [
                 '$scope',
                 '$state',
                 '$window',
                 'User',
                 function($scope, $state, $window, User) {
                     $scope.submit = function() {
                         User.unsubscribe($scope.user)
                             .then(function(response) {
                                 $window.alert('Successfully unsubscribed from Daystage\'s newsletter.');
                                 $window.location.href = "http://www.daystage.com";
                                 console.log(response.data);
                             }, function unsubscribeError(response) {
                                 $window.alert('Successfully unsubscribed from Daystage\'s newsletter.');
                                 $window.location.href = "http://www.daystage.com";
                                 console.log(response.data);
                             });
                     }
                 }
             ]
         })

         .state('help', {
             url: "/help",
             templateUrl: "./views/help.html",
             controller: [
                 '$scope',
                 '$state',
                 '$window',
                 'User',
                 function($scope, $state, $window, User) {
                     $scope.feedback = function() {
                         User.feedback($scope.type, $scope.description, $scope.user)
                             .then(function(response) {
                                 $window.alert('Feedback Message sent');
                                 $window.location.reload();
                             }, function feedbackError(response) {
                                 $window.alert(response.data);
                                 $window.location.reload();
                             });

                     }
                 }
             ]
         })

         .state('forgot-password', {
             url: "/forgot-password",
             templateUrl: "./views/forgot-password.html"
         })

         .state('user-profile', {
             url: "/user-profile/:userId/activeFilter/:activeFilter",
             params: {
                 from: null,
                 activeFilter: 'stages',
                 userId: 'home'
             },
             templateUrl: "./views/user-profile.html",
             requireLogin: true
         })

         .state('reset-password', {
             url: "/reset-password?token",
             templateUrl: "./views/reset-password.html",
             loggedInAltState: 'home-logged-in'
         })

         .state('confirm', {
             url: "/confirm?token",
             templateUrl: "./views/confirm.html"
         })

         .state('edit-profile', {
             url: "/user-profile/edit",
             templateUrl: "./views/user-profile.html"
         })

         .state('upload-stage', {
             url: "/upload-stage",
             templateUrl: "./views/upload-stage.html"
         })

         .state('vote-video', {
             url: "/vote-video?sid",
             templateUrl: "./views/vote-video.html"
         });
     }
 ]);
