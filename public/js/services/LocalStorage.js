/**
 * Todo - cleanup, use promises, avoid events :D
 */
daystageApp.factory('LocalStorage', [
    'localStorageService',
    function(localStorageService) {
        return {

            isSupported: function() {
                return localStorageService.isSupported ? true : false;
            },

            get: function(key) {
                return localStorageService.get(key);
            },

            set: function(key, val) {
                if (localStorageService.isSupported) {
                    return localStorageService.set(key, val);
                }

                return null;
            },


        };
    }
]);
