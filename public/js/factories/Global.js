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
            url: 'https://www.daystage.com',
            domain: 'https://api.daystage.com',
            googleApiKey: 'AIzaSyC0BTKRk6aaIM4DDA0x5FAulInWDowQbSE',
            facebookClientId: '1184796598213509',
            youTubeClientId: '943938568565-rqu4utn00b4pp5kva80bb7d1b2embobe.apps.googleusercontent.com'
        };

        // return {
        //     url: 'http://localhost:5555',
        //     domain: 'https://dev.daystage.com',
        //     googleApiKey: 'AIzaSyBCHUHvdOhjuL15N9M3NWj5G6Wgvd4x50Y',
        //     facebookClientId: '1712877018994605',
        //     youTubeClientId: '525063588477-deo747mc6acdbi44orhuct8s1gok88r3.apps.googleusercontent.com'
        // };
    }
]);
