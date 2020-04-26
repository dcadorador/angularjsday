daystageApp.factory('SearchService', [
    'Global',
    '$http',
    '$rootScope',
    function(Global, $http, $rootScope) {
        return {

            /**
             * Type of search
             * Examples:
             * stage
             * people
             */
            type: 'stage',

            /**
             * The query.
             * Examples:
             * nick,alcala - firstName,lastName
             * nick - firstName
             * alcala - lastName
             * davao - city
             * philippines - country
             * music or vocal - category
             */
            q: '',

            /**
             * Narrow down search results by indicating the
             * location to search for.
             * Example:
             * davao - city
             */
            location: '',

            /**
             * Sort by.
             * Examples:
             * applause - order by applause.
             * views - order by views.
             * followers - order by followers, this is only
             * for SearchService.type = 'people'
             */
            sortBy: 'applause',

            /**
             * Sort direction.
             * Examples:
             * desc - descending
             * asc - ascending
             */
            dir: 'desc',

            /**
             * The response.
             */
            response: {},

            /**
             * Pagination metadata.
             */
            page: {
                currentPage: 1,
                hasMorePages: false,
                items: []
            },

            /**
             * Generate URL parameters from this service' properties.
             */
            _params: function() {
                var parameter = '';
                var _this = this;
                angular.forEach(this, function(index, value) {
                    if (typeof _this[value] == 'string') {
                        parameter += value + '=' + _this[value] + '&';
                    }
                });
                return parameter;
            },

            /**
             * Load the data.
             */
            _load: function(parameter, action) {
                var _this = this;
                $rootScope.$broadcast('events.search.loading');
                $http.get(Global.domain + '/daystage/search?' + parameter).then(function(response) {
                    _this.response = response;
                    _this.page.currentPage = response.data.data.currentPage;
                    _this.page.hasMorePages = response.data.data.hasMorePages;
                    angular.forEach(response.data.data.items, function(item, index) {
                        _this.page.items.push(item);
                    });
                    $rootScope.$broadcast('events.search.success', action);
                }, function(response) {
                    _this.response = response;
                    $rootScope.$broadcast('events.search.fail', action);
                });
            },

            /**
             * Search.
             */
            search: function() {
                if (!this.q && !this.location) {
                    this.response = {};
                    $rootScope.$broadcast('events.search.success', this.response);
                }
                this.page.items = [];
                return this._load(this._params() + 'page=1', 'search');
            },

            /**
             * Clear.
             */
            clear: function() {
                this.q = '';
                this.location = '';
            },

            /**
             * Next page.
             */
            nextPage: function() {
                if (!this.page.hasMorePages)
                    return false;
                this.page.currentPage++;
                return this._load(this._params() + 'page=' + this.page.currentPage, 'next');
            },

            /**
             * Prev page.
             */
            prevPage: function() {
                if (this.page.currentPage > 1)
                    return false;
                this.page.currentPage--;
                return this._load(this._params() + 'page=' + this.page.currentPage, 'prev');
            }

        };
    }
]);
