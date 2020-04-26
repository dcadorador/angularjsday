/**
 * Other configurations.
 */
 daystageApp.run([
     '$state',
     '$rootScope',
     '$timeout',
     'User',
     'Facebook',
     'YouTube',
     function ($state, $rootScope,$timeout, User, Facebook) {

         // initialize 3rd party libraries
         Facebook.initialize();
         //YouTube.initialize();

         // set some redirects on certain scenarios
         $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {

             $rootScope.$$childHead.mobileMenuOpen = false;

             if (toState.requireLogin && !User.isLoggedIn()) {
                 event.preventDefault();
                 $state.go('home');
             }

             if (toState.loggedInAltState && User.isLoggedIn()) {
                 event.preventDefault();
                 $state.go(toState.loggedInAltState, toParams);
             }

             // cached the user info if there is none
             if (!User.hasCachedUserInfo()) {
                 try {
                     User.userInfo();
                 } catch (e) {
                 }
             }

             $timeout(function(){
             },3000);
         });
     }
 ]);

 daystageApp.config([
     '$httpProvider',
     //'Global',
     function ($httpProvider/*, Global*/) {

         // Add an interceptor to the $http provider
         $httpProvider.interceptors.push('AuthInterceptor');

     }
 ]);
