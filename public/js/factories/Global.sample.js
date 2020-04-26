/**
 * Note: This Global.sample.js is just an example of how to setup
 * the App. This is not being used in the App.
 *
 * Global Factory
 *
 * Contains the variables that are often used throughout
 * the application.
 */
 daystageApp.factory('Global', [
     function() {
         return {
             url: 'http://beta.daystage.com',
             //domain: 'http://api.daystage.com',
             domain: 'http://104.196.48.174:81',
             //domain: 'https://api.daystage.com',
             googleApiKey: 'WYSHhjOA0ypkGZgRoirlpPFa',
             facebookClientId: '1712877018994605',
             youTubeClientId: '943938568565-rqu4utn00b4pp5kva80bb7d1b2embobe.apps.googleusercontent.com'
         };
     }
 ]);
